var express = require("express");
//var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");


//use axios to make http requests
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

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

// Handlebars
//app.engine(
  //  "handlebars",
  //  exphbs({
   //   defaultLayout: "main"
   // })
 // );
 // app.set("view engine", "handlebars");

// Connect to the Mongo DB
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//mongoose.connect(MONGODB_URI);
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// Routes

// A GET route for scraping the Complex website
app.get("/scrape", function (req, res) {
    // grab the body of the html with axios
    axios.get("https://www.complex.com").then(function (response) {
        // load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        $("gtm-article h2").each(function (i, element) {
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

        res.send("Scrape Complete");
    });
});

app.get("/articles", function(req,res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
