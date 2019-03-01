var express = require("express");

var router = express.Router();

router.get("/", function (req, res) {
    console.log(hbsObject);
    res.render("index", hbsObject);
});

module.exports = router;