var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Express Router
var router = express.Router();

require("./config/routes")(router);

var logger = require("morgan");
var mongoose = require("mongoose");

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(__dirname + "/public"));


// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// bodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(router);

// Connect to the Mongo DB
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(db, function(error) {
    if(error) {
        console.log(error);
    }
    else {
        console.log("mongoose connection is successful");
    }
});
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

//mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

//Routes
var routes = require("./routes/htmlRoutes")(app);

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
