# Guess-Who-Discord-Bot
<h1> Contributors </h1>

<p float="left">
 
 <a href="https://github.com/djvittachi">
    <img src="https://avatars.githubusercontent.com/u/29562434?s=400v=4" width="100"/> 
  </a>
   
  <a href="https://github.com/MysteryPancake"> 
    <img src="https://avatars.githubusercontent.com/u/9063769?s=400&v=4" width="100"/> 
  </a>
  
</p>
 
<h1>About</h1>

<img src="https://i.ibb.co/xG2L66s/Who-s-that.png" height="200"/>

Who's that? is a Discord bot that emulates the popular board game Guess Who? When a game is initated on a server, the bot proceeds to stitch together a collage (Consisting of a maximum of 10 users) and sends it to the two players. Each player receives the name of the user the other player is supposed to guess. Players then take turns guessing who their user is by asking questions about the people in the collage in order to gain information. This bot even allows users to remove pictures from the collage to emulate the real life experience of knocking down the tiles to narrow down their options.

<h1>Commands</h1>

<img src="https://9b16f79ca967fd0708d1-2713572fef44aa49ec323e813b06d2d9.ssl.cf2.rackcdn.com/1140x_a10-7_cTC/questionmark1-1563038597.jpg" height="200"/>

1. `^begin @personyouwanttoplaywith` : To initiate a game of Guess Who
2. `^remove @useryouwanttoremovefromthecollage` : To "knock" out a tile from the collage who you don't think is the answer
3. `^guess @youranswer` : For when you think you know who it is

<h1>Story Behind The Bot</h1>

<img src="https://cdn-gamesworldau.pressidium.com/wp-content/uploads/2020/05/guess-who-2.jpg" height="200"/>

Remember <b>that</b> game? Well so did I a few days ago. "Wish I could play that again" I thought to myself. All the while, my Discord chat interface was open on my second screen. The member list caught my eye and then I wondered, "It'd be pretty cool if I could use all those avatars for a collage so that two people could play Guess Who at any given time. But this time it would be even better because the questions they'd ask each other wouldn't be restricted to the superficial, but also what they personally know about each other".

But I knew this wouldn't be feasible. How on Earth could I stitch together an array of avatar URL's on command into a collage and then send it back to an user

After digging through StackExchange forums like a rabid gopher, I found the answer in the form of this red crayon here. <a href="https://www.npmjs.com/package/jimp">JIMP</a>, as the creators call it. An NPM that allows for image manipulation for Node.JS applications.

3 days of Maths, semantics and brainstorming later, I had a functional Guess Who Discord bot. While it was functional, it was also far from being efficient. I reached out to a few Uni friends to help me streamline the code and <a href="https://github.com/MysteryPancake">MysteryPancake</a> was instrumental in making this happen. As I've only been learning Javascript for a short amount of time, he helped transform the code into something usable (and readable). A large portion of this project would've fallen short without that input so please go check out his work.

With all this being said, we're not looking to maintain this code past what we've already provided. This is meant to provide base functionality for a Guess Who game and our focus was its core mechanics as opposed to aesthetics. With that being said, I'd love to see what you come up with using the code, so please feel free to reach out to me with relation to any of your completed work.

Thanks for checking out our bot,

Regards,

Daniel
