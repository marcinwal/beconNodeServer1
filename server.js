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


function extractParams(req){
  query = (url.parse(req.url,true));
  return query.query;
};

//========================================== mocking to delete
//mocking function to get data from DB server
//DB reply with json to forward to spotify
app.get('/song',function(req,res){
  res.json(MOCK_SONGS);
  console.log(MOCK_SONGS);
});

//called in case of in/out after DB contact
app.get('/spotify',function(req,res){
  params=extractParams(req);
  console.log('Spotify is getting data');
  res.json({success:200,comment:'happy and updated'});
});

//initial DB reply with email details 
//replying with beacon numbers 
app.get('/party_details',function(req,res){
  params = extractParams(req);
  console.log(params);
  console.log('DB is getting email details and replies with beacon dets:'+params.email);
  res.json({ "beacon_major": "33613", "beacon_minor": "120" });
});

//========================================== end of mocking



function jsonCall(object,path,callback) {
  request.get(path,object, function (error,response,body){
    if (!error && response.statusCode == 200) {
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
    //modification of params for spotify
    jsonCall(params,SPOTIFY_PATH,function(response){
      console.log(response);
    });
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
  jsonCall({email:params.email},BLUE_PATH_INITIAL_QRY,function(response){
    res.jsonp(response); //sending back to the mobile

});

server.listen(process.env.PORT || 9999, function() {
  console.log('server is watching you...');
});

module.exports = server;       