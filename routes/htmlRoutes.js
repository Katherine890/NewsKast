var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {
    // Load index page
    app.get("/", function (req, res) {
        res.render("index");
    });

    // A GET route for scraping the Complex website
    app.get("/scrape", function (req, res) {
        db.Article.remove({}, function(err) {
            console.log("Articles collection removed");
          });
        // grab the body of the html with axios
        axios.get("http://www.mtv.com/news/").then(function (response) {
            // load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            $("article").each(function (i, element) {
                var result = {};

                result.title = $(this)
                    .find("h1")
                    .children("a")
                    .text()
                    .trim()
                 result.link = $(this)
                     .children("a")
                     .attr("href");
                result.summary = $(this)
                    .find(".subhead")
                    .text()
                    .trim()
                console.log(result);
                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });

            res.send("Scrape Complete");
        });
    });

    app.get("/articles", function (req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.post("/articles/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
}