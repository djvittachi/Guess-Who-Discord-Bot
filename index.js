const Discord = require("discord.js");
const config = require("./config.json");
var Jimp = require('jimp');

const client = new Discord.Client();

client.login(config.BOT_TOKEN);

const prefix = "^";
let avatars = [];
let remove = false;
let playerOne = "";
let playerTwo = "";
let playerOneCharacter = "";
let playerTwoCharacter = "";
let playerOneAvatars = [];
let playerTwoAvatars = [];
let playerRemoving = "0";
let playerOneCharacterUsername = "";
let playerTwoCharacterUsername = "";


client.on("message", function(message) {

    if (message.author.bot) return;
    if (!message.guild) {message.channel.send("You tryna make me crash bro?")};
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();


    //Function to send picture when it's all stitched together
    function sendPicture() {if (remove == false){
        client.users.cache.get(playerOne).send("The user that player two has to guess is" + " " + playerTwoCharacterUsername,{files: ["public/image/game.jpg"]})
        client.users.cache.get(playerTwo).send("The user that player one has to guess is" + " " + playerOneCharacterUsername,{ files: ["public/image/game.jpg"]})
    }
    
    else if (playerRemoving == playerOne) {client.users.cache.get(playerOne).send({ files: ["public/image/game.jpg"]})}
    else if (playerRemoving == playerTwo) {client.users.cache.get(playerTwo).send({ files: ["public/image/game.jpg"]})};
        
        
    }

    if (command == "begin") {
        if (!message.mentions.users.first()||  !message.mentions.users) {message.channel.send("You must mention someone to play with");return};
        playerOne = message.author.id;
        playerTwo = message.mentions.users.first().id;
        generateGame(); 
        message.channel.send("Your game is generating, this will take a little under a minute so please bear with the bot :)");
    }

    function  generateGame() {
        let gameSize = 0;
        const server = client.guilds.cache.get(message.guild.id);


    // This function gets all the necessary user details and then uses the callback function stitchAvatars() in order to combine the pictures when it's done fetching
        let fetchAvatars = (collage) => { 
            if(!remove) {
            server.members.fetch().then((members) => {
                members.forEach(user => {
                    fetchUsers(user, collage, members)

                })
            })}
            else{collage();}
        }

        async function fetchUsers(user, collage, members) {

            await client.users.fetch(user.id).then(newUser => {
                let newAvatar = newUser.avatarURL({
                    format: 'png'
                });

                avatars.push(newAvatar + "|" + newUser.id);
                if (avatars.length == members.size) {
                   if(avatars.length>10) {
                       avatars = avatars.slice(0,10);
                   }
                    

                    let playerOneIndex = Math.floor(((Math.random())*avatars.length))
                    let playerTwoIndex = Math.floor(((Math.random())*avatars.length))

                    let playerOneCharacterData = avatars[playerOneIndex].split("|");
                    playerOneCharacter = playerOneCharacterData[1];

                    let playerTwoCharacterData = avatars[playerTwoIndex].split("|");
                    playerTwoCharacter = playerTwoCharacterData[1];

                    playerOneCharacterUsername = client.users.cache.get(playerOneCharacter).username;
                    playerTwoCharacterUsername = client.users.cache.get(playerTwoCharacter).username;

                    playerOneAvatars = avatars.slice(0,10);
                    playerTwoAvatars = avatars.slice(0,10);


                    collage()
                };



            })
        }


        function stitchAvatars() {
           
          
          // I can't remember why I wanted it to place the first image out of the loop but there was a reason
            let data = avatars[0].split("|");
            Jimp.read(data[0])
                .then(image => {
                    // Do stuff with the image.
                    let canvas = new Jimp(500, 200);
                    image.resize(100, 100);
                    canvas.composite(image, 0, 0);
                    let horizontalMovement = 0;
                    let verticalMovement = 0;



                    let combineImages = (saveImages) => {
                        
                        if (avatars.length > 10) {
                            gameSize = 10; //limits the game size to 10 players for obvious reasons
                        } 
                        
                        else {
                            gameSize = avatars.length; //in case there's less than 10 people in the server
                        };
                        for (let i = 1; i < gameSize; i++) {
                            let newData = avatars[i].split("|");
                            Jimp.read(newData[0]).then(newImage => {


                               //Keeps incrementing on the x-axis until it reaches the boundary, at which point it starts placing on the second row by adjusting the y and x accordingly
                                if (horizontalMovement < 400) {
                                    horizontalMovement = horizontalMovement + 100;
                                } else {
                                    horizontalMovement = 0;
                                    verticalMovement = 100;
                                }
                                newImage.resize(100, 100);
                                canvas.composite(newImage, horizontalMovement, verticalMovement)




                            })
                        };
                        // I didn't know how else to wait for the compositing to finish lol
                        setTimeout(function() {
                            saveImages()
                        }, 5000)
                    }

                    function saveImage() {
                        canvas.write("public/image/game.jpg", err => console.error('write error: ', err))
                        setTimeout(function() {
                            sendPicture()
                        }, 2000);
                    }
                    
                    combineImages(saveImage);

                }).catch(err => { // Handle an exception.
                });


        }

        fetchAvatars(stitchAvatars);
      }

  

      if (command == "remove") {

        //validation
          if(!avatars) {message.reply("No games going on ");return;}
          if (!message.mentions.users.first()|| !message.mentions.users) {message.reply("You must mention someone");return;};

          if(message.author.id == playerOne) {
              playerRemoving = playerOne;
          }

          if (message.author.id == playerTwo) {
              playerRemoving = playerTwo;
          }

          let userToRemove = message.mentions.users.first().id;
          let i = 0;
          let userFound = false;

          while(!userFound || i < avatars.length) {
              let userInfo = avatars[i].split("|");
              let userID = userInfo[1];

              if (userToRemove == userID) {
                  message.reply("Removing that user ASAP :)")
                  userFound = true;
                  if (playerRemoving == playerOne) {playerOneAvatars.splice(i,1);avatars = Array.from(playerOneAvatars);}
                  if (playerRemoving == playerTwo) {playerTwoAvatars.splice(i,1);avatars = Array.from(playerTwoAvatars);}
                  remove = true;
                  generateGame();
              }
              i++;
          }


      }

      if (command == "guess") {
        if (!message.mentions.users.first() || !message.mentions.users) {message.channel.send("You must mention someone");return};
        if(!avatars) {message.channel.send("No games going on ");return;}
        
        if(message.author.id == playerOne) {
            if(message.mentions.users.first().id == playerOneCharacter) {message.channel.send("Correct, you won!"); avatars = null}
            else{message.channel.send("nope")};
        }

        if(message.author.id == playerTwo) {
            if(message.mentions.users.first().id == playerTwoCharacter) {message.channel.send("Correct, you won!"); avatars = null}
            else{message.channel.send("nope")};
        }



    }


});