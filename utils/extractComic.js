const fs = require("fs");
const path = require("path");
const unrar = require("unrar");
const sharp = require("sharp");

const MAX_PAGE_WIDTH = 900;

function extractComic(rarPath, outputDir, callback){
    var archive = new unrar(rarPath);
    var returnFiles = [];
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
                returnFiles.push(escape(path.relative(path.join(__dirname, ".."), filePath)));
                if(!fs.existsSync(filePath)){
                    const resizer = sharp().resize(MAX_PAGE_WIDTH);
                    var stream = archive.stream(file.name);
                    stream.on("error", console.error);
                    stream.pipe(resizer).pipe(fs.createWriteStream(filePath));
                }
            });
            returnFiles.sort();
            callback(null, returnFiles);
        }
    });
}

//Recursivly scan directory and create thumbnail images for all cbr files found
//Assumes a structure of directory/collection/comic.cbr
function generateCoverArt(directory, outputDirectory){
    //Check to make sure the output folder exists
    if(!fs.existsSync(outputDirectory)){
        fs.mkdirSync(outputDirectory);
    }

    fs.readdir(directory, function(error, list){
        if(error){
            console.error(error);
            return;
        }
        var collections = list.filter(function(file){
            return fs.statSync(path.join(directory, file)).isDirectory();
        });

        collections.forEach(function(collection){
            fs.readdir(path.join(directory, collection), function(error, list){
                if(error){
                    console.error(error);
                    return;
                }
                var comics = list.filter(function(file){
                    return fs.statSync(path.join(directory, collection, file)).isFile && path.extname(path.join(directory, collection, file)) === ".cbr";
                });

                //Check to make sure the output folder exists
                if(!fs.existsSync(path.join(outputDirectory, collection))){
                    fs.mkdirSync(path.join(outputDirectory, collection));
                }

                comics.forEach(function(comic){
                    //Found cbr file
                    var archive = new unrar(path.join(directory, collection, comic));
                    archive.list(function(error, entries){
                        if(error){
                            console.error(error);
                        }else{
                            //Use first image as cover
                            var files = entries.filter(function(entry){return entry.type === "File";}).sort(function(a, b){
                                if(a.name < b.name)
                                    return -1;
                                if(a.name > b.name)
                                    return 1;
                                return 0;
                            });
                            if(files.length > 1){
                                var cover = files[0];
                                var coverPath = path.join(outputDirectory, collection, "COVER_" + path.basename(comic, ".cbr") + path.extname(cover.name));
                                if(!fs.existsSync(coverPath)){
                                    var stream = archive.stream(cover.name);
                                    stream.on("error", console.error);
                                    stream.pipe(fs.createWriteStream(coverPath));
                                }
                            }
                        }
                   });
                });
            });
        });
    });
}

module.exports.extractComic = extractComic;
module.exports.generateCoverArt = generateCoverArt;
