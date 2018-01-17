//
/// Setup the Symple server

var https   = require("https");
var fs      = require("fs");

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var Symple = require('symple');
var sy = new Symple();
sy.loadConfig(__dirname + '/symple.json'); // see symple.json for options
sy.init();
console.log('Symple server listening on port ' + sy.config.port);


//
/// Setup the demo client web server

var express = require('express'),
  path = require('path'),
  app = express(),
  serverPort = parseInt(sy.config.port)
  clientPort = serverPort - 1;

app.set('port', clientPort);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/');
app.use(express.static(__dirname + '/assets'));
//app.use(express.static(__dirname + '/node_modules/symple-client/src'));
//app.use(express.static(__dirname + '/node_modules/symple-client-player/src'));

app.get('/', function (req, res) {
  res.render('index', {
    port: serverPort,
    peer: {
      user: 'demo',
      name: 'Demo User',
      group: 'public'
    }
  });
});

var webServer = https.createServer(
  {
    key : fs.readFileSync("certs/new/private.key"),
    cert : fs.readFileSync("certs/new/certificate.crt"),
    ca: fs.readFileSync("certs/new/ca_bundle.crt"), 
  }, app).listen(app.get('port'), function () {
  console.log('Web server listening on port ' + app.get('port'));
});

/*
app.listen(app.get('port'), function () {
  console.log('Web server listening on port ' + app.get('port'));
});
*/