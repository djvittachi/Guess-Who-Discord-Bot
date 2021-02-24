const Discord = require("discord.js");
const config = require("./config.json");
const Jimp = require("jimp");

const client = new Discord.Client();

client.login(config.BOT_TOKEN);

const prefix = "^";
let avatars = [];
let playerOne;
let playerTwo;
let playerOneCharacter = "";
let playerTwoCharacter = "";
let playerOneAvatars = [];
let playerTwoAvatars = [];
let playerRemoving;
let playerOneCharacterUsername = "";
let playerTwoCharacterUsername = "";

// Function to send picture when it's all stitched together
function sendPicture(canvas, remove) {
	canvas.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
		if (err) {
			console.error(err);
		} else if (remove === false) {
			playerOne.send(`The user that player two has to guess is ${playerTwoCharacterUsername}`, { files: [buffer] });
			playerTwo.send(`The user that player one has to guess is ${playerOneCharacterUsername}`, { files: [buffer] });
		} else if (playerRemoving.id === playerOne.id) {
			playerOne.send({ files: [buffer] });
		} else if (playerRemoving.id === playerTwo.id) {
			playerTwo.send({ files: [buffer] });
		}
	});
}

async function combineImages(canvas) {

	let i = 0; // This keeps track of how many avatars have been checked
	let movement = 0; // This keeps track of the canvas movement

	for (const avatar of avatars) {

		let newData = avatar.split("|");

		await Jimp.read(newData[0]).then(async (newImage) => {

			await newImage.resize(100, 100);

			// Keeps incrementing on the x-axis until it reaches the boundary, at which point it starts placing on the second row by adjusting the y and x accordingly
			await canvas.composite(newImage, movement % 500, Math.floor(movement / 500) * 100);
			movement += 100;
		});

		// limits the game size to 10 players for obvious reasons
		// This code is a bit trash but I'm not sure of a better way
		i++;
		if (i > 10) {
			break;
		}
	}
}

async function stitchAvatars(remove) {
	const canvas = new Jimp(500, 200);
	await combineImages(canvas);
	sendPicture(canvas, remove);
}

function generateGame(message, remove) {
	// This gets all the necessary user details and then uses the callback function stitchAvatars() in order to combine the pictures when it's done fetching
	if (remove) {
		stitchAvatars(remove);
	} else {
		message.guild.members.fetch().then((members) => {
			members.forEach((member) => {

				let newAvatar = member.user.displayAvatarURL({ format: "png" });
				avatars.push(newAvatar + "|" + member.id);

				if (avatars.length === members.size) {

					// Avatars complete, begin game

					if (avatars.length > 10) {
						avatars = avatars.slice(0, 10);
					}

					let playerOneCharacterData = avatars[Math.floor(Math.random() * avatars.length)].split("|");
					playerOneCharacter = playerOneCharacterData[1];

					let playerTwoCharacterData = avatars[Math.floor(Math.random() * avatars.length)].split("|");
					playerTwoCharacter = playerTwoCharacterData[1];

					playerOneCharacterUsername = client.users.cache.get(playerOneCharacter).username;
					playerTwoCharacterUsername = client.users.cache.get(playerTwoCharacter).username;

					// Clone the array to ensure playerOneAvatars and playerTwoAvatars are separate
					playerOneAvatars = avatars.slice(0, 10);
					playerTwoAvatars = avatars.slice(0, 10);

					stitchAvatars(remove);
				}
			});
		});
	}
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

		playerOne = message.author;
		playerTwo = message.mentions.users.first();

		generateGame(message);

		message.channel.send("Your game is generating, this will take a little under a minute so please bear with the bot :)");

	} else if (command === "remove") {

		// Validation
		if (!avatars) {
			message.reply("No games going on ");
			return;
		} else if (!message.mentions.users || !message.mentions.users.first()) {
			message.reply("You must mention someone");
			return;
		}

		if (message.author.id === playerOne.id) {
			playerRemoving = playerOne;
		} else if (message.author.id === playerTwo.id) {
			playerRemoving = playerTwo;
		}

		let userToRemove = message.mentions.users.first().id;

		for (let i = 0; i < avatars.length; i++) {

			let userInfo = avatars[i].split("|");
			let userID = userInfo[1];

			if (userToRemove === userID) {
				message.reply("Removing that user ASAP :)");

				if (playerRemoving.id === playerOne.id) {
					playerOneAvatars.splice(i, 1);
					avatars = Array.from(playerOneAvatars);
				} else if (playerRemoving.id === playerTwo.id) {
					playerTwoAvatars.splice(i, 1);
					avatars = Array.from(playerTwoAvatars);
				}

				generateGame(message, true);
				// User has been found, end the loop here
				break;
			}
		}
	} else if (command === "guess") {

		if (!message.mentions.users || !message.mentions.users.first()) {
			message.channel.send("You must mention someone");
		} else if (!avatars) {
			message.channel.send("No games going on");
		} else if (message.author.id === playerOne.id) {
			if (message.mentions.users.first().id === playerOneCharacter) {
				message.channel.send("Correct, you won!");
				avatars = null;
			} else {
				message.channel.send("nope");
			}
		} else if (message.author.id === playerTwo.id) {
			if (message.mentions.users.first().id === playerTwoCharacter) {
				message.channel.send("Correct, you won!");
				avatars = null;
			} else {
				message.channel.send("nope");
			}
		} else {
			message.channel.send("nope");
		}

	}
});