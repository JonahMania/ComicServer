const express = require("express");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");

const static = express.static(__dirname + "/public");
const path = require("path");
const app = express();
const port = 8080;
const configRoutes = require("./routes");

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

app.engine('handlebars', handlebarsInstance.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use("/public", static);
configRoutes(app);

app.listen(port, function(){
    console.log("server running on http://localhost:" + port);
});
