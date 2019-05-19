require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');


var axios = require("axios");
var spotify = new Spotify(keys.spotify);
//var bandsintown = require('bandsintown')(APP_ID);
var fs = require("fs"); // filesystem   It does not need to be "npm install"ed

var cmd = process.argv[2];
var args = process.argv.slice(3).join(" ");


//----------OR----------------
// artist, album, or track are the types
var spotifyThisSong = function() {
        spotify
            .search({ type: 'track', query: args })
            .then(function(response) {
                console.log(response.tracks.items[0].artists[0].name);
                console.log(response.tracks.items[0].name);
                console.log(response.tracks.items[0].preview_url);
                console.log(response.tracks.items[0].album.name);
            })
            .catch(function(err) {
                console.log(err);
            });
    }
    // use spotify to get the bandsintown info.  
    // the direct method won't work...I cannot get an app_id
    // hours wasted...
var concertThis = function() {
    axios.get("https://rest.bandsintown.com/artists/" + args + "/events?app_id=codingbootcamp")
        .then(function(response) {
            var barf = response.data;
            console.log(barf[0].venue.name);
            console.log(barf[0].venue.country);
            console.log(barf[0].city);
            console.log(barf[0].datetime);

        })
        .catch(function(error) {
            console.log(error);
        });
}


var movieThis = function() {
    var queryUrl = "http://www.omdbapi.com/?t=" + args + "&y=&plot=short&apikey=24355945";

    // We then run the request with axios module on a URL with a JSON
    //axios.get("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy").then(
    axios.get(queryUrl).then(
        function(response) {
            var movieSpew = response.data;
            //console.log(movieSpew);
            console.log(movieSpew.Title);
            console.log(movieSpew.Year);
            for (var idx = 0; idx < movieSpew.Ratings.length; idx++) {
                if (movieSpew.Ratings[idx].Source === "Rotten Tomatoes" ||
                    movieSpew.Ratings[idx].Source === "Internet Movie Database") {
                    console.log(movieSpew.Ratings[idx].Source + "  " + movieSpew.Ratings[idx].Value);
                }
            }
            //console.log(movieSpew.Ratings)
            //console.log(findElement(movieSpew.Ratings, "Source", "Internet Movie Database")["Value"]);
            //console.log(movieSpew.Ratings["Rotten Tomatoes"].Value);
            console.log(movieSpew.Country);
            console.log(movieSpew.Language);
            console.log(movieSpew.Plot);
            console.log(movieSpew.Actors);
            // Then we print out the imdbRating
            //console.log("The movie's rating is: " + response.data.imdbRating);
        }
    );
}


var doWhatItSays = function() {
    fs.readFile("./random.txt", "utf8", (error, stuff) => {
        if (error) {
            console.log(error);
            return;
        }

        var line = stuff.split(",");
        cmd = line[0];
        args = line[1]; //I think I can get away with this, since it is in quotes.
        //I would need to re-use slice like I do on the command line otherwise
        runSwitch();
    });
}

var runSwitch = function() {
    switch (cmd) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Unable to understand the command " + cmd + "\n");

    }
}

runSwitch();