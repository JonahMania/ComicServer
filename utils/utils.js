const fs = require("fs");
const path = require("path");

function getDirectories(directory){
    return fs.readdirSync(directory).filter(function(file){
        return fs.statSync(path.join(directory, file)).isDirectory();
    });
}

function getJPEGs(directory){
    return fs.readdirSync(directory).filter(function(file){
        return fs.statSync(path.join(directory, file)).isFile() && path.extname(file) === ".jpg";
    });
}

function getCBRs(directory){
    return fs.readdirSync(directory).filter(function(file){
        return fs.statSync(path.join(directory, file)).isFile() && path.extname(file) === ".cbr";
    });
}

module.exports.getDirectories = getDirectories;
module.exports.getJPEGs = getJPEGs;
module.exports.getCBRs = getCBRs;
