// Our Twitter library
const Twitter = require('twit');
var Twit = require('twit');
var config = require('./config');

// Request is needed to retrieve data from the API for the tweetRand() function
var request = require('request');

// We need to include our configuration file
var T = new Twit(require('./config.js'));
var fs = require('fs');

// This is the URL of a search for the latest tweets on the '#pokemon' hashtag.
var PokemonSearch = {q: "#pokemon", count: 10, result_type: "recent"}; 

// Function to find a random number
function between(min, max) {  
	return Math.floor(
	  Math.random() * (max - min) + min
	)
}

// Debug for testing purposes
var debug = false;

// numArr is declared to hold integers temporarily
var numArr = [];

// pre selected quotes
var pre = [
	"I love pokemon #Pokemon",
	"What is your favorite pokemon? #Pokemon", 
	"I cannot wait for the new pokemon tcg #Pokemon",
	"Thinking about snorlax #Pokemon",
	"Pokemon are so cute! #Pokemon",	
];

//pick function to pic random
Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
}

// This function finds the latest tweet with the #pokemon hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', PokemonSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('Success! POKEMON')
			}
			//like the retweet
			var likeId = data.statuses[0].id_str;
		   	T.post('favorites/create', {id:likeId}, function(err,data,response){console.log("just liked a post")});
		    	console.log(data);

			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

//tweet random quote
function tweet() {
	var tweetText = pre.pick();
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

//list of picture to randomly choose from
var prePic = [
	fs.readFileSync('./pic/1.png', {encoding: 'base64'}),
	fs.readFileSync('./pic/2.png', {encoding: 'base64'}),
	fs.readFileSync('./pic/3.png', {encoding: 'base64'}),
	fs.readFileSync('./pic/4.png', {encoding: 'base64'}),
	fs.readFileSync('./pic/5.png', {encoding: 'base64'}),
	fs.readFileSync('./pic/6.png', {encoding: 'base64'}),
	fs.readFileSync('./pic/7.png', {encoding: 'base64'}),
];
//tweet picture
function tweetPic() {
	T.post('media/upload', {media_data: prePic.pick()}, function (err, data, response) {
		var mediaIDStr = data.media_id_string
		var altText = "Lovely Pokemon"
		var meta_params = {media_id: mediaIDStr, alt_text: {text: altText}}
		T.post('media/metadata/create', meta_params, function (err, data, response) {
			if (!err) {
				var params = {status: 'loving pokemon life #Pokemon', media_ids: [mediaIDStr] }
				T.post('statuses/update', params, function (err, data, response) {
					console.log(data)
				})
			}
		})
	})
}//

//search for mentions
var UsSearch = {q: "@2700twitbot", count: 10, result_type: "recent"};

//if someone mentions us we will respond to tweet
function mentions() {
	T.get('search/tweets', UsSearch, function (error, data) {
		// log out any errors and responses
		console.log(error, data);
		// If our search request to the server had no errors...
		if (!error) {
		  var mentionId = data.statuses[between(0, data.statuses.length)];
		  var id = mentionId.id_str;
		  var mentioner = '@' + mentionId.user.screen_name;
		  var tweet = mentioner + " " + pre.pick();

		  T.post('statuses/update', {status: tweet, in_reply_to_status_id: id }, function (err, reply) {
			if (err != null){
				console.log('Error: ', err);
			}
			else {
				console.log('Tweeted: ', tweet);
			}
		  })
		}
		// However, if our original search request had an error, we want to print it out here.
		else {
			console.log('There was an error with your hashtag search:', error);
		}
	  });
}

function alterTweet() {
	//replying to anyone who didn't mention us is against Twitter violations
	T.get('search/tweets', UsSearch, function(error, data) {
		//log out any errors and responses
		console.log(error, data);

		//if our search request to the server had no errors...
		if (!error) {
			var alter = data.statuses[between(0, data.statuses.length)];
			var tweet = alter.text;
			var alterId = alter.id_str
			var toReply = alter.user.screen_name;

			//make sure to not reply to ourselves
			while (toReply == '2700twitbot') {
				var alter = data.statuses[between(0, data.statuses.length)];
				var tweet = alter.text;
				var alterId = alter.id_str
				var toReply = alter.user.screen_name;
			}
			
			//console.log("Tweet to reply to: ", tweet);
			//console.log("alterID is: ", alterId);

			//alter text by making vowels uppercase
			var finalTweet = tweet.replace(/a|e|i|o|u/gi, function(x) {
				return x.toUpperCase();
			});

			//cleanup
			finalTweet = finalTweet.replace('RT', '');
			finalTweet = finalTweet.trim();

			if (finalTweet.startsWith('@')) {
				var pos = 0;
				while (!finalTweet.startsWith(' ', pos)) {
					pos++;
				}

				finalTweet = finalTweet.substring(pos);
			}

			//add the pokemon hashtag to increase our following
			finalTweet = finalTweet + "\n #pokemon";

			//@ the person who we reply to
			finalTweet = '@' + toReply + ' ' + finalTweet;

			//post the reply
			T.post('statuses/update', {status: finalTweet, in_reply_to_status_id: alterId}, function(error, data) {
				if (error != null) {
					console.log('Error: ', error);
				} else {
					console.log('Replied: ', finalTweet);
				}
			});
		}
	});
}

// tweet random quote using the poke api, tweetText comes from the runBot() function
function tweetRand(tweetText) {
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
			// This code searches through the data until we reach the user
            //console.log(reply);
            var shoutOuters = reply.users;
            var luckyUser = shoutOuters[Math.floor(Math.random() * shoutOuters.length)].screen_name;
            console.log(shoutOuters);
            console.log(luckyUser);
          if (debug) 
              console.log("debug shouted " + luckyUser);
          else {
              // Now shoutout that user - switch compliments.length back for 5 if the code does not work
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

//follows back the most recent person that followed
function followFollowers() {
	T.get('followers/list', {count:1}, function(err, reply) {
		if (err != null) {
			console.log('Error: ', err)
		} else {
			var follower = reply.users[0].screen_name;
			console.log(follower);
			T.post('friendships/create', {screen_name: follower }, function(err, reply) {
				if (err != null) {
					console.log('Error: ', err);
				} else {
					console.log('Followed: ' + follower);
				}
			});
		}
	});
}

//follows random tweeter from 100 most recent #pokemon tweets
function followPokemonTweeters() {
	T.get('search/tweets', PokemonSearch, function (err, reply) {
		if (err != null) {
			console.log('Error: ', err)
		} else {
			var tweetId = reply.statuses[Math.floor(Math.random() * 10)].user.screen_name;
			console.log(tweetId);
			T.post('friendships/create', {screen_name: tweetId }, function(err, reply) {
		    	if (err != null) {
		     		console.long('Error: ', err);
			 	} else {
			 		console.log('Followed fellow pokemon enthusiast: ' + tweetId)
			 	}
			});
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
            pokeName + " is my favorite pokemon. #Pokemon",
            "your pokemon sucks. it's nowhere near as good as " + pokeName + " #Pokemon",
            "i literally know nothing about pokemon but i think " + pokeName + " is cool! #Pokemon",
            pokeName + " is the pokemon of the day! #Pokemon",
            "i challenge you all to a pokemon duel! i'll use my favorite pokemon, " + pokeName + "#Pokemon"
        ]

        var tweetText = tweetArr[tweetNum];

        // Random fair picker system that will choose randomly, but cycle through each function once only
		// In essence, once a function is put in the numArray, it will not run again until every function has run 

		var finalRand = Math.floor(Math.random() * 9);

		// if every function has been run, clear the array
		if (numArr.length == 9) {
			numArr = [];
		}

		// keeps randomly updating finalRand until it is not found in numArray
		while (numArr.includes(finalRand) !== false) {
			finalRand = Math.floor(Math.random() * 9);
		}

		// once found, the function will run, so add the number to numArray
		numArr.push(finalRand);

		console.log(finalRand + "is the condition");
		console.log(numArr);
		
        // This switch case has a case for each integer, with a specific function assigned to each case
		switch (finalRand) {
			case 0:
				retweetLatest();
				break;
			case 1:
				tweet();
				break;
			case 2:
				mentions();
				break;
			case 3:
				tweetPic();
				break;
			case 4:
				followFollowers();
				break;
			case 5:
				tweetRand(tweetText);
				break;
			case 6:
				shoutOut();
				break;
			case 7:
				alterTweet();
				break;
			case 8:
				followPokemonTweeters();
				break;
			default:
				console.log("Error, the default switch case has been reached.");
				break;
		}
    })
}

// runBot() is called the first time the code is run
runBot();

// cycles the code every 2 hours, so runBot will occur every 2 hours
setInterval(runBot, 2000 * 60 * 60);
