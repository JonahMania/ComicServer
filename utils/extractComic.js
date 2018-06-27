const fs = require("fs");
const path = require("path");
const unrar = require("unrar");

var archive = new unrar(path);

function extractComic(rarPath, outputDir, callback){
    var archive = new unrar(rarPath);
    archive.list(function(error, entries){
        if(error){
            callback(error, null);
        }else{
            //Check to make sure the output folder exists
            if(!fs.existsSync(outputDir)){
                fs.mkdirSync(outputDir);
            }

            //Create folder with comicbook name
            var comicFolder = outputDir + "/" +  path.basename(rarPath, ".cbr");
            if(!fs.existsSync(comicFolder)){
                fs.mkdirSync(comicFolder);
            }

            //Get all directory and file entries
            directories = entries.filter(function(entry){return entry.type === "Directory";});
            files = entries.filter(function(entry){return entry.type === "File";});

            //Create all directories
            directories.forEach(function(directory){
                var directoryPath = comicFolder + "/" + directory.name;
                //Check if this comic has a folder
                 if(!fs.existsSync(directoryPath)){
                    fs.mkdirSync(directoryPath);
                }
            });

            //Create all files
            files.forEach(function(file){
                var filePath = comicFolder + "/" + file.name;
                if(!fs.existsSync(filePath)){
                    var stream = archive.stream(file.name);
                    stream.on("error", console.error);
                    stream.pipe(fs.createWriteStream(filePath));
                }
            });
        }
    });
}

//Recursivly scan directory and create thumbnail images for all cbr files found
function generateCoverArt(directory){
    fs.readdir(directory, function(error, list) {
        if(error){
            console.error(error);
            return;
        }
        list.forEach(function(file){
            if(file){
                file = directory + '/' + file;
                fs.stat(file, function(error, stat){
                    if(stat && stat.isDirectory()){
                        generateCoverArt(file);
                    }else if(stat && path.extname(file) === ".cbr"){
                        //Found cbr file
                        var archive = new unrar(file);
                        archive.list(function(error, entries){
                            if(error){
                                console.error(error);
                            }else{
                                //Use first image as cover
                                var files = entries.filter(function(entry){return entry.type === "File";})
                                if(files.length > 1){
                                    var cover = files[0];
                                    var coverPath = directory + "/COVER_" + path.basename(file, ".cbr") + path.extname(cover.name);
                                    if(!fs.existsSync(coverPath)){
                                        var stream = archive.stream(cover.name);
                                        stream.on("error", console.error);
                                        stream.pipe(fs.createWriteStream(coverPath));
                                    }
                                }
                            }
                       });
                    }
                });
            }
        });
    });
}

module.exports.extractComic = extractComic;
module.exports.generateCoverArt = generateCoverArt;
