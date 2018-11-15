//START:SETUP1
var expect = require('chai').expect;
var db = require('../../../db');
var ObjectId = require('mongodb').ObjectId;
var task = require('../../../models/task');
//END:SETUP1

var validateTask =
  require('../../../public/javascripts/common/validate-task');

//START:SETUP1
describe('task model tests', function() {
  var sampleTask;
  var sampleTasks;
  
  before(function(done) {
    db.connect('mongodb://localhost/todotest', done);
  });

  after(function() {
    db.close();
  });
//END:SETUP1

//START:SETUP2
  var id = function(idValue) {
    return new ObjectId(idValue);
  };
  
  beforeEach(function(done) {
    sampleTask = {name: 'a new task', month: 12, day: 10, year: 2016};

    sampleTasks = [
      {_id: id('123412341240'), name: 'task1', month: 10, day: 5, year: 2016},
      {_id: id('123412341241'), name: 'task2', month: 11, day: 2, year: 2016},
      {_id: id('123412341242'), name: 'task3', month: 12, day: 8, year: 2016},
    ];
    
    db.get().collection('tasks').insert(sampleTasks, done);
  });

  afterEach(function(done) {
    db.get().collection('tasks').drop(done);
  });  
//END:SETUP2

//START:ALL
  it('all should return all the tasks', function(done) {
    var callback = function(err, tasks) {
      expect(tasks).to.be.eql(sampleTasks);
      done();
    };
    
    task.all(callback);
  });
//END:ALL

//START:GET1
  it('get should return task with given id', function(done) {
    var callback = function(err, task) {
      expect(task.name).to.be.eql('task1');
      expect(task.month).to.be.eql(10);
      done();
    };
    
    task.get('123412341240', callback);
  });
//END:GET1

//START:GET2  
  it('get should return null for non-existing task', function(done) {
    var callback = function(err, task) {
      expect(task).to.be.null;
      done();
    };
    
    task.get(2319, callback);
  });
//END:GET2

//START:ADD_POSITIVE
  it('add should return null for valid task', function(done) {
    var callback = function(err) {
      expect(err).to.be.null;
      task.all(function(err, tasks) {
        expect(tasks[3].name).to.be.eql('a new task');
        done();
      });
    };
  
    task.add(sampleTask, callback);
  });
//END:ADD_POSITIVE

//START:ADD_DUPLICATE
  var expectError = function(message, done) {
    return function(err) {
      expect(err.message).to.be.eql(message);
      done();       
    };
  };
  
  it('add should return Error if task already exists', function(done) {
    sampleTask = sampleTasks[0];
    delete sampleTask._id;
    task.add(sampleTask, expectError('duplicate task', done));
  });
//END:ADD_DUPLICATE

//START:ADD1
  it('task.validate should refer to validateTask', function() {
    expect(task.validate).to.be.eql(validateTask);
  });
//END:ADD1

//START:ADD2
  it('add should call validate', function(done) {
    task.validate = function(task) {
      expect(task).to.be.eql(sampleTask);
      done();
      return validateTask(task);
    };
    
    task.add(sampleTask, function() {});
    
    task.validate = validateTask;
  });
//END:ADD2

//START:ADD3
  it('add should handle validation failure', function(done) {
    var onError = function(err) {
      expect(err.message).to.be.eql('unable to add task');
      done();
    };
    task.validate = function(task) { return false; };

    task.add(sampleTask, onError);
    
    task.validate = validateTask;
  });
//END:ADD3

//START:DELETE1
  it('delete should send null after deleting existing task', function(done) {
    var callback = function(err) {
      expect(err).to.be.null;
      task.all(function(err, tasks) {
        expect(tasks.length).to.be.eql(2);
        done();
      });
    };
    task.delete('123412341242', callback);    
  });
//END:DELETE1

//START:DELETE2
  it('delete should return Error if task not found', function(done) {
    task.delete('123412341234123412342319', 
      expectError('unable to delete task with id: 123412341234123412342319',
       done));
  });
//END:DELETE2

//START:DELETE3
  it('delete should return Error if task id not given', function(done) {
    task.delete(undefined, 
      expectError('unable to delete task with id: undefined', done));      
  });  
//END:DELETE3
//START:SETUP1
});
//END:SETUP1
