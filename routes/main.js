const path = require("path");
const utils = require("../utils/utils");
var router = require('express').Router();

router.get('/', function(req, res){
    var coverArtDirectory = req.app.get("coverArtDirectory");
    var collections = [];
    utils.getDirectories(coverArtDirectory).forEach(function(directory){
        var image = utils.getJPEGs(path.join(coverArtDirectory, directory)).sort()[0];
        collections.push({
            "name": directory,
            "image": path.join(coverArtDirectory, directory, image),
            "link": "/" + directory
        });
    });
    res.render("home/home", {"links": collections});
});

router.get("/favicon.ico", function(req, res){
    res.send("", 404);
});

router.get("/:collection", function(req, res){
    var comicDirectory = req.app.get("comicDirectory");
    var collection = req.params.collection;
    var links = [];
    var comics = utils.getCBRs(path.join(comicDirectory, collection)).sort();
    comics.forEach(function(comic){
        var comicName = path.basename(comic, ".cbr");
        links.push({
            "name": comicName,
            "image": "/" + path.join(req.app.get("coverArtDirectory"), collection, "COVER_" + comicName + ".jpg"),
            "link": "/comic/" + collection + "/" + comicName
        });
    });
    res.render("home/home", {"links": links});
});

module.exports = router;
