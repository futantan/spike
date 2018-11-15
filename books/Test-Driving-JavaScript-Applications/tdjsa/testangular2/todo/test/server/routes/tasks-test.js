//START:REQUIRE
var expect = require('chai').expect;
var sinon = require('sinon');
var task = require('../../../models/task');
var express = require('express');
//END:REQUIRE

//START:SETUP
describe('tasks routes tests', function() {
  var sandbox;
  var router;
  
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    
    sandbox.stub(express, 'Router').returns({
      get: sandbox.spy(),
      post: sandbox.spy(),
      delete: sandbox.spy()
    });

    router = require('../../../routes/tasks');
  });
  
  afterEach(function() {
    sandbox.restore();
  });

//END:SETUP

//START:GET_PATH
  it('should register URI / for get', function() {
    expect(router.get.calledWith('/', sandbox.match.any)).to.be.true;
  });
//END:GET_PATH

//START:GET_ROUTE_HANDLE
  var stubResSend = function(expected, done) {
    return { send: function(data) {
      expect(data).to.be.eql(expected);
      done();
    }};
  };
  
  it("get / handler should call model's all & returns result", 
    function(done) {
    var sampleTasks = [{name: 't1', month: 12, day: 1, year: 2016}];
    
    sandbox.stub(task, 'all', function(callback) {
      callback(null, sampleTasks);
    });
  
    var req = {};
    var res = stubResSend(sampleTasks, done);

    var registeredCallback = router.get.firstCall.args[1];
    registeredCallback(req, res);
  });
//END:GET_ROUTE_HANDLE

//START:GET_ID1
  it('should register URI /:id for get', function() {
    expect(router.get.calledWith('/:id', sandbox.match.any)).to.be.true;
  });
//END:GET_ID1

//START:GET_ID2
  it("get /:validid handler should call model's get & returns a task",
    function(done) {
    var sampleTask = {name: 't1', month: 12, day: 1, year: 2016};
    
    sandbox.stub(task, 'get', function(id, callback) {
      expect(id).to.be.eql(req.params.id);
      callback(null, sampleTask);
    });
    
    var req = {params: {id: 1}};    
    var res = stubResSend(sampleTask, done);

    var registeredCallback = router.get.secondCall.args[1];
    registeredCallback(req, res);
  });
//END:GET_ID2
//START:GET_ID3
  it("get /:invalidid handler should call model's get & returns {}",
    function(done) {
    var sampleTask = {};
    
    sandbox.stub(task, 'get', function(id, callback) {
      expect(id).to.be.eql(req.params.id);
      callback(null, null);
    });
    
    var req = {params: {id: 2319}};    
    var res = stubResSend(sampleTask, done);

    var registeredCallback = router.get.secondCall.args[1];
    registeredCallback(req, res);
  });
//END:GET_ID3

//START:POST1
  it('should register URI / for post', function() {
    expect(router.post.calledWith('/', sandbox.match.any)).to.be.true;
  });
//END:POST1
//START:POST2
  it("post / handler should call model's add & returns success message",
    function(done) {
    var sampleTask = {name: 't1', month: 12, day: 1, year: 2016};
    
    sandbox.stub(task, 'add', function(newTask, callback) {
      expect(newTask).to.be.eql(sampleTask);
      callback(null);
    });
    
    var req = { body: sampleTask };
    var res = stubResSend('task added', done);

    var registeredCallback = router.post.firstCall.args[1];
    registeredCallback(req, res);
  });
//END:POST2
//START:POST3
  it("post / handler should return error message on failure", function(done) {
    var sampleTask = {month: 12, day: 1, year: 2016};
    
    sandbox.stub(task, 'add', function(newTask, callback) {
      expect(newTask).to.be.eql(sampleTask);
      callback(new Error('unable to add task'));
    });
    
    var req = { body:  sampleTask };
    var res = stubResSend('unable to add task', done);

    var registeredCallback = router.post.firstCall.args[1];
    registeredCallback(req, res);
  });
//END:POST3

//START:DELETE1
  it('should register URI /:id for delete', function() {
    expect(router.delete.calledWith('/:id', sandbox.match.any)).to.be.true;
  });
//END:DELETE1
//START:DELETE2
  it("delete /:validid handler should call model's delete, returns success",
    function(done) {
    sandbox.stub(task, 'delete', function(id, callback) {
      expect(id).to.be.eql(req.params.id);
      callback(null);
    });
    
    var req = {params: {id: 1}};    
    var res = stubResSend('task deleted', done);

    var registeredCallback = router.delete.firstCall.args[1];
    registeredCallback(req, res);
  });
//END:DELETE2
//START:DELETE3
  it("delete /:invalidid handler should return error message", 
    function(done) {
    sandbox.stub(task, 'delete', function(id, callback) {
      expect(id).to.be.eql(req.params.id);
      callback(new Error('unable to delete task with id: 2319'));
    });
    
    var req = {params: {id: 2319}};    
    var res = stubResSend('unable to delete task with id: 2319', done);

    var registeredCallback = router.delete.firstCall.args[1];
    registeredCallback(req, res);
  });
//END:DELETE3

//START:SETUP
});
//END:SETUP
