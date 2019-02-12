module.exports = function(router) {
    router.get("/", function(req, res) {
        res.render("index");
    });

    router.get("/savedArticles", function(req, res) {
        res.render("savedArticles");
    });
}