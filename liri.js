require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

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

// Spotify
function spotifyFunc() {
    spotify.search({ type: 'track', query: parameters, limit: 1 }, function (err, data) {

        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var musicInfo = data.tracks.items[0];
        console.log("\nArtist: ", musicInfo.artists[0].name, "\nSong's name: ", musicInfo.name,
            "\nSong's preview link: ", musicInfo.preview_url, "\nAlbum: ", musicInfo.album.name);
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
                var tkey = tweets[key];
                console.log("\nUser Name: @" + tkey.user.screen_name, "\nCreated at: ", tkey.created_at, 
                "\nText: ", tkey.text, "\nRetweeted: ", tkey.retweet_count, "\nSource: ", tkey.source);
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
            var dataOmdb = JSON.parse(body);
            console.log("\nTitle: ", dataOmdb.Title, "\nYear: ", dataOmdb.Year, 
            "\nIMDB Rating: ", dataOmdb.imdbRating);
            if (dataOmdb.Ratings[1].Source.Value === "Rotten Tomatoes") {
                console.log("Rotten Tomatoes Rating: ", dataOmdb.Ratings[1].Value);
            }
            else {
                console.log("Rotten Tomatoes Rating: N/A");
            }
            console.log("Country: ", dataOmdb.Country, "\nLanguage: ", dataOmdb.Language, 
            "\nPlot: ", dataOmdb.Plot, "\nActors: ", dataOmdb.Actors);
            console.log("\n>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>")
        }
    })
};

//Do what it says
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
