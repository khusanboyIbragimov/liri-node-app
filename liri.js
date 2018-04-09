require("dotenv").config();

var keys = require("./keys.js");

var request = require("request");

var Spotify = require('node-spotify-api');

var Twitter = require('twitter');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Spotify
var command = process.argv[2];
var parameters = process.argv[3];

if (command === "spotify-this-song") {
    spotifyFunc();
}
else if (command === "my-tweets") {
    tweetFunc();
}
else if (command === "movie-this") {
    omdbFunc();
}
else if (command === "do-what-it-says") {
    doWhatItSay();
}
else {
    parameters = "Ace of base", "The Sign";
    spotifyFunc();
    
    parameters = "Mr. Nobody";
    omdbFunc();
}




function spotifyFunc() {
    spotify.search({ type: 'track', query: parameters, limit: 1 }, function (err, data) {

        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var musicInfo = data.tracks.items[0];
        console.log("Artist: ", musicInfo.artists[0].name);
        console.log("Song's name: ", musicInfo.name);
        console.log("Song's preview link: ", musicInfo.preview_url);
        console.log("Album: ", musicInfo.album.name);



    });
};


// Tweeter
function tweetFunc() {
    var params = {
        screen_name: '@KhusanboyI',

    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {

        } if (command === "my-tweets") {
            for (var key in tweets) {
                console.log("User Name: @" + tweets[key].user.screen_name);
                console.log("Created at: ", tweets[key].created_at);
                console.log("Text: ", tweets[key].text);
                console.log("Retweeted: ", tweets[key].retweet_count);
                console.log("Source: ", tweets[key].source);
                console.log(">==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>")
            }
        }

    });
}

// OMDB

function omdbFunc() {
    var queryUrl = "http://www.omdbapi.com/?t=" + parameters + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            console.log("Title: ", JSON.parse(body).Title);
            console.log("Year: ", JSON.parse(body).Year);
            console.log("IMDB Rating: ", JSON.parse(body).imdbRating);
            if (JSON.parse(body).Ratings[1].Source.Value === "Rotten Tomatoes") {
                console.log("Rotten Tomatoes Rating: ", JSON.parse(body).Ratings[1].Value);
            }
            else {
                console.log("Rotten Tomatoes Rating: N/A");
            }
            console.log("Country: ", JSON.parse(body).Country);
            console.log("Language: ", JSON.parse(body).Language);
            console.log("Plot: ", JSON.parse(body).Plot);
            console.log("Actors: ", JSON.parse(body).Actors);
        }


    })
};


function doWhatItSay() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        console.log(data);

        var dataArr = data.split(",");
        parameters = dataArr[1];
        spotifyFunc();
        console.log(dataArr);
    });
}
