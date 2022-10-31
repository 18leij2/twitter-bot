var Twit = require("twit");
var T = new Twit(require('./config.js'));
var request = require('request');

// DEBUG
var debug = false;		// if we don't want it to post to Twitter! Useful for debugging!

Array.prototype.pick = function() {
	return this[Math.floor(Math.random() * this.length)];
}

function tweet(tweetText) {
    if(debug) 
		console.log('Debug mode: ', tweetText);
	else
		T.post('statuses/update', {status: tweetText }, function (err, reply) {
			if (err != null){
				console.log('Error: ', err);
			}
			else {
				console.log('Tweeted: ', tweetText);
			}
		});
}

function shoutOut() {
    var compliments = [
        "You da best!",
        "You were raised well",
        "Follow me for a chance to be shouted next!",
        "Let's get this bread.",
        "It takes two hand to clap."
    ]
    T.get('followers/list', { count:30 },  function (err, reply) {
        if (err != null) {
          console.log('Error: ', err);
        }
        else {
            //console.log(reply);
            var shoutOuters = reply.users;
            var luckyUser = shoutOuters[Math.floor(Math.random() * shoutOuters.length)].screen_name;
            console.log(shoutOuters);
            console.log(luckyUser);
          if (debug) 
              console.log("debug shouted " + luckyUser);
          else {
              //Now shoutout that user
              T.post('statuses/update', { status: ("Shoutout to " + luckyUser + " for the follow! " + compliments[Math.floor(Math.random() * 5)]) }, function (err, reply) {
                  if (err != null) {
                      console.log('Error: ', err);
                  }
                  else {
                      console.log('Shouted: ' + luckyUser);
                  }
              });
          }
      }
  });
}
    

function runBot() {
    request("https://pokeapi.co/api/v2/pokemon/", function(err, response, data) {
        var newData = JSON.parse(data);
        var pokeList = newData.results;
        console.log(pokeList);
        var randInt = Math.floor(Math.random() * 20);
        console.log(randInt);
        var pokeName = pokeList[randInt].name;
        var tweetNum = Math.floor(Math.random() * 5);

        tweetArr = [
            pokeName + " is my favorite pokemon.",
            "your pokemon sucks. it's nowhere near as good as " + pokeName,
            "i literally know nothing about pokemon but i think " + pokeName + " is cool",
            pokeName + " is the pokemon of the day!",
            "i challenge you all to a pokemon duel! i'll use my favorite pokemon, " + pokeName
        ]

        var tweetText = tweetArr[tweetNum];
        //tweet(tweetText);
        shoutOut();
    })
}

runBot();
console.log("did I tweet?");
 

setInterval(runBot, 2000 * 60 * 60);


// Run the bot
//runBot();

// And recycle every hour
//setInterval(runBot, 1000 * 60 * 60);
