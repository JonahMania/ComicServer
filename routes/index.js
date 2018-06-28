const path = require("path");
const main = require("./main");
const comic = require("./comic");

const constructorMethod = function(app){
    app.use("/", main);
    app.use("/comic", comic);
    //Catch all remaining endpoints and return an error page
    app.use("*", function(req, res){
        route = path.resolve(`public/error.html`);
        res.sendFile(route);
    })
};

module.exports = constructorMethod;
