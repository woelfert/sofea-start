'use strict';
//Dependencies
var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    ejs = require('ejs'),
    path = require('path'),
    favicon = require('serve-favicon');

//WebServer setup
var ip = undefined;
var port = process.env.PORT || 9001;
var app = express();
var rootPath = path.normalize(__dirname);

app.set('views', rootPath + '\\web');
app.use(express.static(path.join(rootPath, 'web')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '5mb'
}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.use(function noCache(req, res, next) {
    if (req.url.indexOf('.js') > 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
    }
    next();
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    next();
});

//Routes
app.route('/*/*').get(function (req, res) {
    var stripped = req.url.split('.')[0];
    var requestedView = path.join('./', stripped);
    res.render(requestedView, function (err, html) {
        if (err) {
            console.log("Error rendering partial '" + requestedView + "'\n", err);
            res.status(404).end();
        } else {
            res.send(html);
        }
    });
});

app.route('/').get(function (req, res) {
    res.render('index');
});

// Start server
app.listen(port, ip, function () {
    console.log('Woelfert Express server listening on %s:%d, in %s mode', ip, port, app.get('env'));
});

// Expose app
exports = module.exports = app;
