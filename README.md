# Guess-Who-Discord-Bot

<h1> Commands </h1>

<img src = "https://9b16f79ca967fd0708d1-2713572fef44aa49ec323e813b06d2d9.ssl.cf2.rackcdn.com/1140x_a10-7_cTC/questionmark1-1563038597.jpg" height = 200px> </img> <br/>
&nbsp  1. ^begin @personyouwanttoplaywith : To initiate a game of Guess Who <br/>
&nbsp  2. ^remove @useryouwanttoremovefromthecollage : To "knock" out a tile from the collage who you don't think is the answer <br/>
&nbsp  3. ^guess @youranswer : For when you think you know who it is <br/>


<h1> Problems with this bot </h1>

<img src = "https://thumbs.dreamstime.com/b/broken-robot-fix-hand-drawn-vector-cartoon-illustration-trying-to-itself-81326219.jpg" height = 200px> </img> <br/>
The main problem is that I only designed this to be used over a single instance (i.e , only one game can be run at a time). I was so focussed on whether even a single game was possible or not that it didn't really occur to me at the time to use an object or otherwise. In any case, it shouldn't be too much work to rectify that mistake, just a matter of making sure that everything is where it's supposed to be. Using channelID's to identify instances is something I've had success with in the past and is something you might find useful. For those of you that want to use a database, well, good luck.


<h1 > Story Behind The Bot </h1>
<img src= https://cdn-gamesworldau.pressidium.com/wp-content/uploads/2020/05/guess-who-2.jpg height = 200px> </img>

Remember <b> that </b> game? Well so did I a few days ago. "Wish I could play that again" I thought to myself. All the while, my Discord chat interface was open on my second screen. The member list caught my eye and then I wondered, "It'd be pretty cool if I could use all those avatars for a collage so that two people could play Guess Who at any given time. But this time it would be even better because the questions they'd ask each other wouldn't be restricted to the superficial, but also what they personally know about each other".

But I knew this wouldn't be feasible. How on Earth could I stitch together an array of avatar URL's on command into a collage and then send it back to an user

<img src = https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-11/256/crayon.png height = 200px> </img>

After digging through StackExchange forums like a rabid gopher, I found the answer in the form of this red crayon here. JIMP, as the creators call it. An NPM that allows for image manipulation for Node.JS applications.

3 days of Maths, semantics and brainstorming later, I present to you, a functional (I said functional, not pretty) Guess Who Discord bot.

You're probably wondering. Why am I making this publicly available? There's two main reasons actually : 

1. This is far from being a finished product. I only started learning Javascript last August as part of a course, and even that was fairly rudimentary (As you would expect from an introductory course). What I know now has been acquired over a short time span and hasn't had a lot of time to take root in my brain, so as you would expect my coding is a little rough around the edges, to say the least. In fact, this is the first time I've had to use Callbacks and Asynchronous code, which for any experienced coder would be a fairly regular part of their routine.
 
2. I genuinely see this being a really fun thing to have on Discord. I played a test round with a friend and we both thought it was a lot of fun. The fact that it has a personal touch because you'd possibly be describing and guessing people you already know about was something we found really fun relative to the actual physical game. With that being said, I know I have neither the time nor the expertise to convert this into something that can be used in the long run. While it was a lot of work to even make this possible, it is far from perfect and I believe that in the right hands, this launching pad of sorts that I've created can be the basis for something really cool.

Having said that, I want to point out the fact that I will not be developing this code any further. I present this to you as a catalyst to your creativity , no strings attached, do whatever you want with it (If you can, be sure to reach out to me to let me know if you ever get something set up with it).

I once again apologize for the noobiness, if there is any,

Regards, <b/>

Daniel
