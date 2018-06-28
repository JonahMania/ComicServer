var router = require('express').Router();
const fs = require("fs");
const path = require("path");
const extractComic = require("../utils/extractComic");

router.get('/*', function(req, res){
    var file = path.join(req.app.get("comicDirectory"), req.path) + ".cbr";
    var cacheDirectory = req.app.get("cacheDirectory");

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
            res.render("comic/comic", {pages:response});
        }
    });
});

module.exports = router;
