var express = require('express');
var app = express();
var server = require('http').createServer(app);
var http = require('http');
var util = require('util');
var url = require('url');
var DB_PATH = 'https://turnup-tunein.herokuapp.com/';
var $ = require('jquery');
var request = require('request');
// var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set("jsonp callback", true);

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

// app.use(bodyParser.urlencoded({'extended':'true'}));
// app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.get('/', function(req, res) {
  res.render('index');
  console.log("homepage")
});

function jsonCall(object) {
  request.post('https://turnup-tunein.herokuapp.com', function (error, response, body){
    if (!error && response.statusCode == 200) {
      console.log("Sent To Matteo");
    }
  });
};

app.get('/in', function(req, res) {
  console.log("Device In Range Of Beacon")
  // console.log(util.inspect(req));
  query = (url.parse(req.url,true));
  // console.log(res.query);
  params = query.query;
  console.log(params);
  console.log(params.email);
  res.jsonp({ "my": "Jack" });
  jsonCall(params);
});

app.get('/out', function(req, res) {
  console.log("Device Disconected From Beacon");
  console.log(req.toString());
  res.jsonp({ "my": "object" });
});

app.get('/qry', function() {

  res.jsonp({ "my": "Jack" });
});

server.listen(process.env.PORT || 9999, function() {
  console.log('server is watching you...');
});

module.exports = server;       