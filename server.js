var express = require('express');
var app = express();
var server = require('http').createServer(app);
var http = require('http');
var util = require('util');
var url = require('url');
var request = require('request');

var DB_PATH = 'https://turnup-tunein.herokuapp.com';
var SERVER_PATH = 'https://fierce-dawn-6227.herokuapp.com';



//mock paths to change to the real one 
var BLUE_PATH = 'http://localhost:9999/song';
var BLUE_PATH_INITIAL_QRY = 'http://localhost:9999/party_details' 
var SPOTIFY_PATH = 'http://localhost:9999/spotify';
var MOCK_SONGS = {songs_ids:[1,2],beacon:33613};

app.set('view engine', 'ejs');
app.set("jsonp callback", true);

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});


//========================================== mocking to delete
//mocking function to get data from DB server
app.get('/song',function(req,res){
  res.json(MOCK_SONGS);
  console.log(MOCK_SONGS);
});

app.get('/spotify',function(req,res){

});

//========================================== end of mocking

function extractParams(req){
  query = (url.parse(req.url,true));
  return query.query;
};

function jsonCall(object,path,callback) {
  console.log("trying to hit Matteo");
  request.get(path,object, function (error,response,body){
    if (!error && response.statusCode == 200) {
      console.log("Sent To Matteo");
      reply = JSON.parse(response.body);
      callback(reply); //to check
    } else
    {
      console.log(error);
    }
  });
};



app.get('/', function(req, res) {
  res.render('index');
  console.log("homepage")
});



app.get('/in', function(req, res) {
  console.log("Device In Range Of Beacon") //beacon detected by mobile
  params = extractParams(req);
  jsonCall(params,BLUE_PATH,function(response){  //calling db with params to get ids
    console.log(response.songs_ids);
    console.log(response.beacon);
  });

});

app.get('/out', function(req, res) {
  console.log("Device Disconected From Beacon");
  console.log(req.toString());
  res.jsonp({ "my": "object" });
});

app.get('/qry', function(req, res) {
  console.log("Query is hit");
  params = extractParams(req);
  console.log(params.email);
  //getting info from DB and forwarding to mobile client
  //to do contact DB -- first mock it
  res.jsonp({ "beacon_major": "33613", "beacon_minor": "1285" });
});

server.listen(process.env.PORT || 9999, function() {
  console.log('server is watching you...');
});

module.exports = server;       