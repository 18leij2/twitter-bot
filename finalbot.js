var Twit = require("twit");
var T = new Twit(require('./config.js'));
var request = require('request');

// DEBUG
var debug = false;		// if we don't want it to post to Twitter! Useful for debugging!

// attempt to make a pick function, I didn't use this but useful for functions
Array.prototype.pick = function() {
	return this[Math.floor(Math.random() * this.length)];
}

// tweet random quote using the poke api, tweetText comes from the runBot() function
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

// chooses a random follower and shouts them out with a tweet
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
            //console.log(reply);     for testing purposes, commented due to console spam
            var shoutOuters = reply.users;
            var luckyUser = shoutOuters[Math.floor(Math.random() * shoutOuters.length)].screen_name;
            console.log(shoutOuters);
            console.log(luckyUser);
          if (debug) 
              console.log("debug shouted " + luckyUser);
          else {
              // Now shoutout that user, switch compliments.length back for 5 if the code does not work
              T.post('statuses/update', { status: ("Shoutout to " + luckyUser + " for the follow! " + compliments[Math.floor(Math.random() * compliments.length)]) }, function (err, reply) {
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
    
// runs the bot, this function is run every iteration similar to the examplebot
function runBot() {
    // takes the api data, parse it, get random numbers and assign to certain data
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

        // future updates will implement another random picker using switch case that will
        // choose which functions out of tweet, shoutout, and all your other methods will
        // occur, to reduce spam and increase variation
        //tweet(tweetText);     commented to reduce spam during testing
        shoutOut();
    })
}

// runs the bot
runBot();
console.log("did I tweet?");
 
// cycles the code every 2 hours, so runBot will occur every 2 hours
setInterval(runBot, 2000 * 60 * 60);

