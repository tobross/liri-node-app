var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var twitter = require("twitter");
var command = process.argv[2];
var commandTwo = process.argv[3];
var deco = "_,.~*'*~.,_,.~*'*~.,_,.~*'*~.,_,.~*'*~.,_,.~*'*~.,_,.~*'*~.,"
var line = "\n" + "========================================================================" + "\n"
switch (command) {
    case "tweets":
        myTweets();
        break;

    case "this-song":
        spotifyThisSong();
        break;

    case "doIt":
        doWhatItSays();
        break;

    case "movie":
        movieThis();
        break;

    default:
        console.log(line + "\n" + "This is the list of possible commands" + "\n" +
            "tweets" + "\n" +
            "this-song 'SONG NAME HERE'" + "\n" +
            "doIt" + "\n" +
            "movie 'MOVIE TITLE HERE'" + "\n" +
            line + "\n" +
            "Place your entries in double quotes if they are more than a single word.");
};

function myTweets() {
    var client = new twitter(keys.twitter);
    var text = "text";
    var tweetText = "";
    var params = {
        status: tweetText
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(line + tweets[i].text + line);
                var tweetNum = i + 1;
                var time = tweets[i].created_at;
                var timeArr = time.split(' ');
                var output = tweetNum + "\n" + tweets[i].text + "\n" + timeArr.slice(0, 4).join('- ') + "\n";
                process.stdout.write(output);
                fs.appendFile("log.txt", +line + output, function (error) {
                    if (error) throw error;
                });
            }
            console.log("Tweets Stored @ log.txt");

        };
    });
}

function spotifyThisSong() {
    var spotify = new Spotify(keys.spotify);

    var songName = commandTwo;


    if (!commandTwo) {
        noInput();
    }
    spotify.search({
        type: "track",
        query: songName
    }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
        }

        var songs = data.tracks.items;

        console.log("Results: " + songs.length + " total tracks.");
        for (i = 0; i < 5; i++) {
            var songsRecord = line + songs[i].artists[0].name + line + songs[i].name + line + songs[i].preview_url + line + songs[i].album.name + line;
            var artists;
            console.log(songsRecord);
            fs.appendFile("log.txt", +line + songsRecord, function (error) {
                if (error) throw error;
            });
        }

    });
};

function noInput() {
    console.log("Enter a valid input next time!");
    process.exit();
};

function doWhatItSays() {
    console.log("\nThis command runs the spotify command with data from a local .txt file.")
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log("error");
        }
        // console.log(line + data + line);
        var dataArray = data.split(",");
        console.log(dataArray);
        command = dataArray[0];
        commandTwo = dataArray[1];
        spotifyThisSong();
    });

};

function movieThis() {
    var movie = commandTwo;
    if (!movie) {
        console.log("No entry? You must be Mr. Nobody!" + line);
        movie = "Mr Nobody";
    }
    movieName = movie;
    request("http://omdbapi.com?t=" + movieName + "&y=&plot=shot&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body);
            var movieResults =
                line + "\nTitle: " + movieObject.Title + line +
                "\nYear: " + movieObject.Year + line +
                "\nIMDB Rating: " + movieObject.imdbRating + line +
                "\nRotten Tomatoes Rating: " + movieObject.Ratings[1].Value + line +
                "\nCountry: " + movieObject.Country + line +
                "\nLanguage: " + movieObject.Language + line +
                "\nPlot: " + movieObject.Plot + line +
                "\nActors: " + movieObject.Actors + line;
            console.log(movieResults);
            fs.appendFile("log.txt", + line + movieResults, function (error) {
                if (error) throw error;
            });
        };
    });
};