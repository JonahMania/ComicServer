var router = require('express').Router();
const fs = require("fs");
const path = require("path");
const extractComic = require("../utils/extractComic");

router.get("/*.cbr", function(req, res){
    var file = path.join(req.app.get("comicDirectory"), unescape(req.path));
    var cacheDirectory = req.app.get("cacheDirectory");
    var page = req.query.page || 1;
    if(!fs.existsSync(file)){
            route = path.resolve(`public/error.html`);
            res.sendFile(route);
            return;
    }

    extractComic.extractComic(file, cacheDirectory, function(error, response){
        if(error){
            route = path.resolve(`public/error.html`);
            res.sendFile(route);
        }else{
            res.render("comic/comic", {"pages":response, "page":page});
        }
    });
});

module.exports = router;
