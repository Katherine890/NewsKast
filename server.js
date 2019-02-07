var express = require("express");
//var exphbs = require("express-handlebars");

// Initialize Express
var app = express();

var logger = require("morgan");
var mongoose = require("mongoose");


//use axios to make http requests
//var axios = require("axios");
//var cheerio = require("cheerio");

// Require all models
//var db = require("./models");

var PORT = 3000;

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//mongoose.connect(MONGODB_URI);
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

//Routes
var routes = require("./routes/htmlRoutes")(app);

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
