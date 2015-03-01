var request = require('superagent');
var expect = require('expect.js');

var http = require('http');

var server = require('../server.js');



describe('Server is running',function(){
  it(function(done){
    request.get('localhost:9999').end(function(res){
      expect(res.body).to.contain('HI');
      console.log(res.body);
      done(); //asynchronous test end
    });
  });
});


// describe('Server is running2',function(){

//   before(function(){
//     this.server = http.createServer(server).listen(9999);
//   }); 

//   before(function(done){
//     this.browser.visit('/');
//   });

//   it('should contain HI',function(){
//     expect(this.browser.text).to.contain('HI');
//   });

// });