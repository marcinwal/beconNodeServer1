var server = require('../server.js');
var request = require('request');

describe('server response',function(){
  
  before(function(){
    server.listen(9999);
  });

  after(function(){
    server.close();
  });

  xit('should return 400',function(done){
    request.get("http://localhost:9999",function(err,res,body){
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.equal('HI');
      done();
    });
  });

});