const Discord = require("discord.js");
const config = require("./config.json");
const Jimp = require("jimp");

const client = new Discord.Client();

client.login(config.BOT_TOKEN);

const prefix = "^";
const gameObject = {};

// Function to send picture when it's all stitched together
function sendPicture(gameObj, canvas, playerRemoving) {
	canvas.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
		if (err) {
			console.error(err);
		} else if (!playerRemoving) {
			gameObj.playerOne.send(`The user that player two has to guess is ${gameObj.playerTwoCharacter.username}`, { files: [buffer] });
			gameObj.playerTwo.send(`The user that player one has to guess is ${gameObj.playerOneCharacter.username}`, { files: [buffer] });
		} else if (playerRemoving.id === gameObj.playerOne.id) {
			gameObj.playerOne.send({ files: [buffer] });
		} else if (playerRemoving.id === gameObj.playerTwo.id) {
			gameObj.playerTwo.send({ files: [buffer] });
		}
	});
}

async function combineImages(canvas, avatars) {

	let movement = 0; // This keeps track of the canvas movement

	for (const avatar of avatars) {
		const avatarURL = avatar.avatarURL({ format: "png" });
		await Jimp.read(avatarURL).then(async (newImage) => {
			await newImage.resize(100, 100);
			// Keeps incrementing on the x-axis until it reaches the boundary, at which point it starts placing on the second row by adjusting the y and x accordingly
			await canvas.composite(newImage, movement % 500, Math.floor(movement / 500) * 100);
			movement += 100;
		});
	}
}

async function stitchAvatars(gameObj, avatars, playerRemoving) {
	const canvas = new Jimp(500, 200);
	await combineImages(canvas, avatars);
	sendPicture(gameObj, canvas, playerRemoving);
}

async function generateGame(gameObj) {
	// This gets all the necessary user details and then uses the callback function stitchAvatars() in order to combine the pictures when it's done fetching
	let avatars = [];

	await gameObj.guild.members.fetch().then((members) => {
		// members.some is like a for loop but it can be stopped by returning true
		members.some((member) => {
			// Users must have an avatar to be listed
			if (member.user.avatarURL({ format: "png" })) {
				avatars.push(member.user);
			}
			// Stop the loop when there are 10 avatars, otherwise keep going
			return avatars.length >= 10;

		});
	});
	// Avatars complete, choose random characters
	gameObj.playerOneCharacter = avatars[Math.floor(Math.random() * avatars.length)];
	gameObj.playerTwoCharacter = avatars[Math.floor(Math.random() * avatars.length)];

	// Clone the array to ensure playerOneAvatars and playerTwoAvatars are separate
	gameObj.playerOneAvatars = avatars.slice();
	gameObj.playerTwoAvatars = avatars.slice();

	stitchAvatars(gameObj, avatars);
}

client.on("message", (message) => {

	if (message.author.bot || !message.content.startsWith(prefix)) return;
	if (!message.guild) {
		message.channel.send("You tryna make me crash bro?");
	}

	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(" ");
	const command = args[0].toLowerCase();

	if (command === "begin") {

		if (!message.mentions.users || !message.mentions.users.first()) {
			message.channel.send("You must mention someone to play with");
			return;
		}

		const gameObj = {
			playerOne: message.author,
			playerTwo: message.mentions.users.first(),
			guild: message.guild
		};

		gameObject[message.guild.id] = gameObj;
		generateGame(gameObj);

		message.channel.send("Your game is generating, this will take a little under a minute so please bear with the bot :)");

	} else if (command === "remove") {

		// Validation
		const gameObj = gameObject[message.guild.id];
		if (!gameObj) {
			message.reply("No games going on ");
			return;
		} else if (!message.mentions.users || !message.mentions.users.first()) {
			message.reply("You must mention someone");
			return;
		}

		let avatars;
		let playerRemoving;

		if (message.author.id === gameObj.playerOne.id) {
			avatars = gameObj.playerOneAvatars;
			playerRemoving = gameObj.playerOne;
		} else if (message.author.id === gameObj.playerTwo.id) {
			avatars = gameObj.playerTwoAvatars;
			playerRemoving = gameObj.playerTwo;
		} else {
			message.reply("You aren't playing a game");
			return;
		}

		const userToRemove = message.mentions.users.first().id;

		for (let i = 0; i < avatars.length; i++) {
			if (userToRemove === avatars[i].id) {
				message.reply("Removing that user ASAP :)");
				// Remove from array
				avatars.splice(i, 1);
				// Generate new avatars
				stitchAvatars(gameObj, avatars, playerRemoving);
				// User has been found, end the loop here
				break;
			}
		}
	} else if (command === "guess") {
		// Validation
		const gameObj = gameObject[message.guild.id];
		if (!gameObj) {
			message.channel.send("No games going on");
		} else if (!message.mentions.users || !message.mentions.users.first()) {
			message.channel.send("You must mention someone");
		} else if (message.author.id === gameObj.playerOne.id) {
			if (message.mentions.users.first().id === gameObj.playerOneCharacter.id) {
				message.channel.send("Correct, you won!");
				// Reset game on this server
				delete gameObject[message.guild.id];
			} else {
				message.channel.send("nope");
			}
		} else if (message.author.id === gameObj.playerTwo.id) {
			if (message.mentions.users.first().id === gameObj.playerTwoCharacter.id) {
				message.channel.send("Correct, you won!");
				// Reset game on this server
				delete gameObject[message.guild.id];
			} else {
				message.channel.send("nope");
			}
		} else {
			message.reply("You aren't playing a game");
		}
	}
});