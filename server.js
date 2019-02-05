var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//use axios to make http requests
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
//var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//mongoose.connect(MONGODB_URI);
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// Routes

// A GET route for scraping the Complex website
app.get("/scrape", function (req, res) {
    // grab the body of the html with axios
    axios.get("https://www.complex.com/").then(function (response) {
        // load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        $("h2.feed-article__title").each(function (i, element) {
            var result = {};

            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            db.Article.create(result)
              .then(function(dbArticle) {
                  console.log(dbArticle);
              })
              .catch(function(err) {
                  console.log(err);
              });
        });


        


    });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
