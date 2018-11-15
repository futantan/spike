//START:BEFORE
describe('tasks service tests', function() {
  var service;
  var httpBackend;
  var notCalled = function() { throw 'not expected'; };
  
  var newTaskJSON = {name: 'task a', month: 6, day: 10, year: 2016};  
                 
  beforeEach(module('todoapp'));

  beforeEach(inject(function(TasksService, $httpBackend) {
    service = TasksService;
    httpBackend = $httpBackend;
  }));
//END:BEFORE

//START:FIRST
  it('get should call service, register success function', function(done) {
    httpBackend.expectGET('tasks')
               .respond(200, '...some data...');
    
    var success = function(data, status) {
      expect(status).to.be.eql(200);
      expect(data).to.be.eql('...some data...');
      done();
    };
    
    service.get(success, notCalled);
    httpBackend.flush();
  });
//END:FIRST
            
//START:SECOND
  it('get should call service, register error function', function(done) {
    httpBackend.expectGET('tasks')
               .respond(404, 'Not Found');
    
    var error = function(data, status) {
      expect(status).to.be.eql(404);
      expect(data).to.be.eql('Not Found');
      done();
    };                   
    
    service.get(notCalled, error);
    httpBackend.flush();
  });
//END:SECOND

//START:THIRD
  it('add should call service, register success function', function(done) {
    httpBackend.expectPOST('tasks', newTaskJSON)
               .respond(200, 'added');
  
    var success = function(data) {
      expect(data).to.be.eql('added');
      done();
    };
    
    service.add(newTaskJSON, success, notCalled);
    httpBackend.flush();
  });
//END:THIRD

//START:FOURTH
  it('add should call service, register error function', function(done) {
    httpBackend.expectPOST('tasks', newTaskJSON)
               .respond(500, 'server error');
  
    var error = function(error, status) {
      expect(error).to.be.eql('server error');
      expect(status).to.be.eql(500);
      done();
    };
    
    service.add(newTaskJSON, notCalled, error);
    httpBackend.flush();
  });
//END:FOURTH

//START:FIFTH
  it('delete should call service, register success function', function(done) {
    httpBackend.expectDELETE('tasks/1234123412341234')
               .respond(200, 'yup');

    var success = function(data) {
      expect(data).to.be.eql('yup');
      done();
    };
    
    service.delete('1234123412341234', success, notCalled);
    httpBackend.flush();
  });
//END:FIFTH

//START:SIXTH
  it('delete should call service, register error function', function(done) {
    httpBackend.expectDELETE('tasks/1234123412341234')
               .respond(500, 'server error');

    var error = function(error, status) {
      expect(error).to.be.eql('server error');
      expect(status).to.be.eql(500);
      done();
    };
    
    service.delete('1234123412341234', notCalled, error);
    httpBackend.flush();
  });
//END:SIXTH

//START:BEFORE  
});
//END:BEFORE