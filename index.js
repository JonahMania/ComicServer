const express = require("express");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const serveIndex = require("serve-index");

const comic = require("./routes/comic");

const static = express.static(__dirname + "/public");
const path = require("path");
const app = express();
var port = 8080;

const cacheDirectory = "public/cache";

var program = require("commander");

program
    .version("0.0.0")
    .arguments("<directory>")
    .action(function(directory){
        comicDirectory = directory;
    })
    .option("-p, --port [port]", "Server port")
    .parse(process.argv);

if(typeof comicDirectory === "undefined"){
    console.error("Directory argument required");
    process.exit(1);
}

if(program.port){
    port = program.port;
}

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine("handlebars", handlebarsInstance.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.set("comicDirectory", comicDirectory);
app.set("cacheDirectory", cacheDirectory);

app.use("/public", static);
app.use("/data", comic);
app.use("/data", express.static(comicDirectory), serveIndex(comicDirectory, {"icons": true}))
app.use("*", function(req, res){
    route = path.resolve(`public/error.html`);
    res.sendFile(route);
});

app.listen(port, function(){
    console.log("server running on http://localhost:" + port);
});
