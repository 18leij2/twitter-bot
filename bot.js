// Our Twitter library
const Twitter = require('twit');
var Twit = require('twit');
var config = require('./config');

// We need to include our configuration file
var T = new Twit(require('./config.js'));
var fs = require('fs');
var b64content = fs.readFileSync('./pic/136.png', {encoding: 'base64'})

// This is the URL of a search for the latest tweets on the '#pokemon' hashtag.
var PokemonSearch = {q: "#pokemon", count: 10, result_type: "recent"}; 

//function to find a random number
function between(min, max) {  
	return Math.floor(
	  Math.random() * (max - min) + min
	)
}

//debug
var debug = false;	

// pre selected quotes
var pre = [
	"I love pokemon",
	"What is your favorite pokemon?", 
	"I cannot wait for the new pokemon tcg",
	"Thinking about snorlax",
	"Pokemon are so cute!",	
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

//tweet random quaote
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

//tweet picture
function tweetPic() {
	T.post('media/upload', {media_data: b64content}, function (err, data, response) {
		var mediaIDStr = data.media_id_string
		var altText = "Lovely Pokemon"
		var meta_params = {media_id: mediaIDStr, alt_text: {text: altText}}
		T.post('media/metadata/create', meta_params, function (err, data, response) {
			if (!err) {
				var params = {status: 'loving pokemon life', media_ids: [mediaIDStr] }
				T.post('statuses/update', params, function (err, data, response) {
					console.log(data)
				})
			}
		})
	})
}

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

// Try to retweet something as soon as we run the program...
retweetLatest();
tweet();
mentions();
tweetPic();
follow();
