var express = require('express');
var fs = require('fs');             // This library gives us access to the computer's file system
var request = require('request');
var cheerio = require('cheerio');
var app = express();

// All the web scraping magic will happen here

app.get('/scrape', function(req, res){

    // The URL we will scrape from - IMDB data for Anchorman 2

    url = 'http://www.imdb.com/title/tt1229340/';

    // The request call...
    // The first parameter is the URL
    // The second parameter is a callback function that takes 3 parameters: an error, the response status code, and the html

    request(url, function(error, response, html){

        // First, check to make sure no errors occurred when making the request

        if(!error){

            // Load the cheerio library with the returned html, which gives us jQuery functionality

            var $ = cheerio.load(html);

            // Define the variables we're going to capture 

            var title, release, rating;

            // Create a json object to store the extracted data

            var json = { title : "", release : "", rating : ""};

            // Traversing the DOM and extracting information...
            // Movie titles are stylized with a CSS class labeled "header," which we'll use as a starting point

            $('.header').filter(function(){

                // Assign the data we filter to a variable

                var data = $(this);

                // Movie titles are contained within the first child element of the header tag
                // We use jQuery to navigate the DOM and retrieve the movie title

                title = data.children().first().text();

                // Release information is located within the last element of the header tag
                // We use jQuery to navigate the DOM and retrieve the release information

                release = data.children().last().children().text();

                // Once we have extracted our data, we'll store it in the json object

                json.title = title;
                json.release = release;

            })

            // Since ratings data is found in a different section of the DOM, we need another jQuery filter to extract it...
            // Ratings data is stored in the .star-box-giga-star class

            $('.star-box-giga-star').filter(function(){

                // Assign the data we filter to a variable

                var data = $(this);

                // Ratings data is exactly where we want it to be, so there's no need to traverse the DOM any further
                // Assign the ratings data to a variable using jQuery

                rating = data.text();

                // Store the ratings data in the json object

                json.rating = rating;
            })
        }

        // Save the json object to the local filesystem using the builtin 'fs' library...
        // The writeFile function accepts three parameters: the output filename, the data that is to be written, and a callback function
        // Prettify the JSON output by calling the JSON.stringify function

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
            console.log('File successfully written! - Check your project directory for the output.json file');
        })

        // Terminate with a message to the browser reminding the client that this app does not have a UI

        res.send('Check your console!')
    })
})

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;