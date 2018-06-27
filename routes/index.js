const path = require("path");
const main = require("./main");

const constructorMethod = function(app){
    app.use("/", main);

    //Catch all remaining endpoints and return an error page
    app.use("*", function(req, res){
        route = path.resolve(`public/error.html`);
        res.sendFile(route);
    })
};

module.exports = constructorMethod;
