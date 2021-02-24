const Discord = require("discord.js");
const config = require("./config.json");
var Jimp = require('jimp');

const client = new Discord.Client();

client.login(config.BOT_TOKEN);

const prefix = "^";

let gameObject = {};

client.on("message", function(message) {



    if (message.author.bot) return;
    if (!message.guild) {message.channel.send("You tryna make me crash bro?")};
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();


    //Function to send picture when it's all stitched together
    function sendPicture() {if (gameObject[message.channel.id].remove == false){
        client.users.cache.get(gameObject[message.channel.id].playerOne).send("The user that player two has to guess is" + " " + gameObject[message.channel.id].playerTwoCharacterUsername,{files: ["public/image/game.jpg"]})
        client.users.cache.get(gameObject[message.channel.id].playerTwo).send("The user that player one has to guess is" + " " + gameObject[message.channel.id].playerOneCharacterUsername,{ files: ["public/image/game.jpg"]})
    }
    
    else if (gameObject[message.channel.id].playerRemoving == gameObject[message.channel.id].playerOne) {client.users.cache.get(gameObject[message.channel.id].playerOne).send({ files: ["public/image/game.jpg"]})}
    else if (gameObject[message.channel.id].playerRemoving == gameObject[message.channel.id].playerTwo) {client.users.cache.get(gameObject[message.channel.id].playerTwo).send({ files: ["public/image/game.jpg"]})};
        
        
    }

    if (command == "begin") {
        if (!message.mentions.users) {message.channel.send("You must mention someone to play with");return};


        gameObject[message.channel.id] = {
            avatars : [],
            remove : false,
            playerOne : "",
            playerTwo : "",
            playerOneCharacter : "",
            playerTwoCharacter : "",
            playerOneAvatars : [],
            playerTwoAvatars : [],
            playerRemoving : "0",
            playerOneCharacterUsername : "",
            playerTwoCharacterUsername : "",
           }
           
        gameObject[message.channel.id].playerOne = message.author.id;
        gameObject[message.channel.id].playerTwo = message.mentions.users.first().id;
        generateGame(); 
        message.channel.send("Your game is generating, this will take a little under a minute so please bear with the bot :)");
    }

    function  generateGame() {
        const server = message.guild


    // This function gets all the necessary user details and then uses the callback function stitchAvatars() in order to combine the pictures when it's done fetching
        let fetchAvatars = (collage) => { 
            if(!gameObject[message.channel.id].remove) {
            server.members.fetch().then((members) => {
                members.forEach(user => {
                    fetchUsers(user, collage, members)

                })
            })}
            else{collage();}
        }

        async function fetchUsers(user, collage, members) {

            await client.users.fetch(user.id).then(newUser => {
                let newAvatar = newUser.displayAvatarURL({
                    format: 'png'
                });

                gameObject[message.channel.id].avatars.push(newAvatar + "|" + newUser.id);
                if (gameObject[message.channel.id].avatars.length == members.size) {
                   if(gameObject[message.channel.id].avatars.length>10) {
                       gameObject[message.channel.id].avatars = gameObject[message.channel.id].avatars.slice(0,10);
                   }
                    

                    let playerOneIndex = Math.floor(((Math.random())*gameObject[message.channel.id].avatars.length))
                    let playerTwoIndex = Math.floor(((Math.random())*gameObject[message.channel.id].avatars.length))

                    let playerOneCharacterData = gameObject[message.channel.id].avatars[playerOneIndex].split("|");
                    gameObject[message.channel.id].playerOneCharacter = playerOneCharacterData[1];

                    let playerTwoCharacterData = gameObject[message.channel.id].avatars[playerTwoIndex].split("|");
                    gameObject[message.channel.id].playerTwoCharacter = playerTwoCharacterData[1];

                    gameObject[message.channel.id].playerOneCharacterUsername = client.users.cache.get(gameObject[message.channel.id].playerOneCharacter).username;
                    gameObject[message.channel.id].playerTwoCharacterUsername = client.users.cache.get(gameObject[message.channel.id].playerTwoCharacter).username;

                    gameObject[message.channel.id].playerOneAvatars = gameObject[message.channel.id].avatars.slice(0,10);
                    gameObject[message.channel.id].playerTwoAvatars = gameObject[message.channel.id].avatars.slice(0,10);


                    collage()
                };



            })
        }


        function stitchAvatars() {
           
          
          // I can't remember why I wanted it to place the first image out of the loop but there was a reason
            let data = gameObject[message.channel.id].avatars[0].split("|");
            Jimp.read(data[0])
                .then(image => {
                    // Do stuff with the image.
                    let canvas = new Jimp(500, 200);
                    image.resize(100, 100);
                    canvas.composite(image, 0, 0);
                  

                    async function combineImages(saveImages) {
                        let i = 1; // This keeps track of how many gameObject[message.channel.id].avatars have been checked
                        let movement = 0; // This keeps track of the canvas movement
                    
                        for (const avatar of gameObject[message.channel.id].avatars) {
                    
                            let newData = avatar.split("|");
                    
                            await Jimp.read(newData[0]).then(async function(newImage) {
                    
                                newImage.resize(100, 100);
                    
                                // Keeps incrementing on the x-axis until it reaches the boundary, at which point it starts placing on the second row by adjusting the y and x accordingly
                                await canvas.composite(newImage, movement % 500, Math.floor(movement / 500) * 100)
                                movement += 100;
                            });
                            // limits the game size to 10 players for obvious reasons
                            // This code is kinda dumb but I'm not sure of a less bad way lol
                            i++;
                            if (i > 10) {
                                break;
                            }
                        }
                        saveImages();
                    }

                    function saveImage() {
                        canvas.write("public/image/game.jpg", function(err, success) {
                            if (err) {
                                console.error("write error: ", err);
                            } else {
                                sendPicture();
                            }
                        });
                    }
                    
                    combineImages(saveImage);

                }).catch(err => { // Handle an exception.
                });


        }

        fetchAvatars(stitchAvatars);
      }

  

      if (command == "remove") {

        //validation
          if(Object.getOwnPropertyNames(gameObject).length == 0) {message.reply("No games going on ");return;}
          if (!message.mentions.users) {message.reply("You must mention someone");return;};

          if(message.author.id == gameObject[message.channel.id].playerOne) {
              gameObject[message.channel.id].playerRemoving = gameObject[message.channel.id].playerOne;
          }

          if (message.author.id == gameObject[message.channel.id].playerTwo) {
              gameObject[message.channel.id].playerRemoving = gameObject[message.channel.id].playerTwo;
          }

          let userToRemove = message.mentions.users.first().id;
          let i = 0;
          let userFound = false;

          while(!userFound || i < gameObject[message.channel.id].avatars.length) {
              let userInfo = gameObject[message.channel.id].avatars[i].split("|");
              let userID = userInfo[1];

              if (userToRemove == userID) {
                  message.reply("Removing that user ASAP :)")
                  userFound = true;
                  if (gameObject[message.channel.id].playerRemoving == gameObject[message.channel.id].playerOne) {gameObject[message.channel.id].playerOneAvatars.splice(i,1);gameObject[message.channel.id].avatars = Array.from(gameObject[message.channel.id].playerOneAvatars);}
                  if (gameObject[message.channel.id].playerRemoving == gameObject[message.channel.id].playerTwo) {gameObject[message.channel.id].playerTwoAvatars.splice(i,1);gameObject[message.channel.id].avatars = Array.from(gameObject[message.channel.id].playerTwoAvatars);}
                  gameObject[message.channel.id].remove = true;
                  generateGame();
              }
              i++;
          }


      }

      if (command == "guess") {
        if (!message.mentions.users) {message.channel.send("You must mention someone");return};
        if(Object.getOwnPropertyNames(gameObject).length == 0) {message.channel.send("No games going on ");return;}
        
        if(message.author.id == gameObject[message.channel.id].playerOne) {
            if(message.mentions.users.first().id == gameObject[message.channel.id].playerOneCharacter) {message.channel.send("Correct, you won!"); gameObject[message.channel.id].avatars = null}
            else{message.channel.send("nope")};
        }

        if(message.author.id == gameObject[message.channel.id].playerTwo) {
            if(message.mentions.users.first().id == gameObject[message.channel.id].playerTwoCharacter) {message.channel.send("Correct, you won!"); gameObject[message.channel.id].avatars = null}
            else{message.channel.send("nope")};
        }



    }


});