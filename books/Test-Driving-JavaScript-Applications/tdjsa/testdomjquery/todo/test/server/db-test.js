//START:REQUIRE
var db = require('../../db');
//END:REQUIRE

//END:GET
//START:CANARY
var expect = require('chai').expect;

describe('db tests', function() {
  it('should pass this canary test', function() {
    expect(true).to.be.true;
  });
//END:CANARY

//START:GET
  it('get should return null connection by default', function() {
    expect(db.get()).to.be.null;
  });
//END:GET

//START:CLOSE1
  it('close should set connection to null', function() {
    db.close();
    expect(db.connection).to.be.null;
  });
//END:CLOSE1

//START:CLOSE2
  it('close should close existing connection', function(done) {
    db.connection = { close: function() { done(); } };
    db.close();
    expect(db.connection).to.be.null;
  });
//END:CLOSE2

//START:CONNECT_GOOD
  it('connect should set connection given valid database name', function(done) {
    var callback = function(err) {
      expect(err).to.be.null;
      expect(db.get().databaseName).to.be.eql('todotest');
      db.close();
      done();
    };
    
    db.connect('mongodb://localhost/todotest', callback);
  });
//END:CONNECT_GOOD

//START:CONNECT_SCHEMA
  it('connect should reject invalid schema', function(done) {
    var callback = function(err) {
      expect(err).to.be.instanceof(Error);
      done();
    };
    
    db.connect('badschema://localhost/todotest', callback);    
  });
//END:CONNECT_SCHEMA

//START:CONNECT_BADNAME
  it('connect should reject invalid name', function(done) {
    var callback = function(err) {
      expect(err).to.be.instanceof(Error);
      done();
    };
    
    db.connect('mongodb', callback);    
  });
//END:CONNECT_BADNAME

//START:CANARY
});
//END:CANARY
