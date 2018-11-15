//START:CANARY
describe('tasks-with builtin functions-tests', function() {
  it('should pass this canary test', function() {
    expect(true).to.be.true;
  });
//END:CANARY

/*
//START:SETUP1
var sandbox;

beforeEach(function() {
  sandbox = sinon.sandbox.create();
});

afterEach(function() {
  sandbox.restore();
});
//END:SETUP1
*/   

/*
//START:SETUP2
//...
var domElements;

beforeEach(function() {
  sandbox = sinon.sandbox.create();

  domElements = {
  };

  sandbox.stub(document, 'getElementById', function(id) {
    if(!domElements[id]) domElements[id] = {};
    return domElements[id];
  });
});
//END:SETUP2
*/

/*
//START:SETUP3
//...
var responseStub;

beforeEach(function() {
  //...
  responseStub = JSON.stringify([
    {_id: '123412341201', name: 'task a', month: 8, day: 1, year: 2016},
    {_id: '123412341202', name: 'task b', month: 9, day: 10, year: 2016},
    {_id: '123412341203', name: 'task c', month: 10, day: 11, year: 2017},
  ]);
});
//END:SETUP3
*/
   
/*
//START:SETUP4
//...
var xhr;

beforeEach(function() {
//...

  xhr = sinon.useFakeXMLHttpRequest();
  xhr.requests = [];
  xhr.onCreate = function(req) { xhr.requests.push(req); }
});

afterEach(function() {
  sandbox.restore();
  xhr.restore();
});
//END:SETUP4
*/          

/*
//START:SETUP5
beforeEach(function() {
  //...
  domElements = {
    name: {value: 'a new task'},
    date: {value: '12/11/2016'},
  };
  //...
});
//END:SETUP5
*/

  var sandbox;
//START:GETELEMENT
  var domElements;
//END:GETELEMENT
  var responseStub;
  var xhr;
//START:GETELEMENT

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    domElements = {
      name: {value: 'a new task'},
      date: {value: '12/11/2016'},
    };

    sandbox.stub(document, 'getElementById', function(id) {
      if(!domElements[id]) domElements[id] = {};
      return domElements[id];
    });
//END:GETELEMENT

    responseStub = JSON.stringify([
      {_id: '123412341201', name: 'task a', month: 8, day: 1, year: 2016},
      {_id: '123412341202', name: 'task b', month: 9, day: 10, year: 2016},
      {_id: '123412341203', name: 'task c', month: 10, day: 11, year: 2017},
    ]);

    xhr = sinon.useFakeXMLHttpRequest();
    xhr.requests = [];
    xhr.onCreate = function(req) { xhr.requests.push(req); };
//START:GETELEMENT
  });
//END:GETELEMENT
  
  afterEach(function() {
    sandbox.restore();
    xhr.restore();
  });

//START:GETTASKS1
  it('getTasks should call callService', function(done) {
    sandbox.stub(window, 'callService', 
      function(params) {
      expect(params.method).to.be.eql('GET');
      expect(params.url).to.be.eql('/tasks');         
      done();
    });

    getTasks();
  });
//END:GETTASKS1

//START:GETTASKS2
  it('getTasks should register updateTasks with callService', function() {  
    var callServiceMock = sandbox.mock(window)
        .expects('callService')
        .withArgs(sinon.match.any, updateTasks);
  
    getTasks();
    callServiceMock.verify();
  });
//END:GETTASKS2

//START:UPDATETASKS1
  it('updateTasks should update message if status != 200', function() {
    updateTasks(404, '..err..');

//START:GETELEMENT_VERIFY
    expect(domElements.message.innerHTML).to.be.eql('..err.. (status: 404)');
//END:GETELEMENT_VERIFY
  });
//END:UPDATETASKS1

//START:UPDATETASKS2
  it('updateTasks should update taskscount', function() {
    updateTasks(200, responseStub);
  
    expect(domElements.taskscount.innerHTML).to.be.eql(3);
  });
//END:UPDATETASKS2

//START:UPDATETASKS3
  it('updateTasks should update tasks table', function() {
    updateTasks(200, responseStub);
  
    expect(domElements.tasks.innerHTML).contains('<table>');
    expect(domElements.tasks.innerHTML).contains('<td>task a</td>');
    expect(domElements.tasks.innerHTML).contains('<td>8/1/2016</td>');
    expect(domElements.tasks.innerHTML).contains('<td>task b</td>');
  });
//END:UPDATETASKS3

//START:CALLSERVICE1
  it('callService should make call to service', function() {
    callService({method: 'GET', url: '/tasks'}, sandbox.spy());
    
    expect(xhr.requests[0].method).to.be.eql('GET');
    expect(xhr.requests[0].url).to.be.eql('/tasks');
    expect(xhr.requests[0].sendFlag).to.be.true;
  });
//END:CALLSERVICE1

//START:CALLSERVICE2
  it('callService should send xhr status code to callback', function() {
    var callback = sandbox.mock().withArgs(200).atLeast(1);
    
    callService({method: 'GET', url: '/tasks'}, callback);    
    xhr.requests[0].respond(200);
    
    callback.verify();
  });
//END:CALLSERVICE2

//START:CALLSERVICE3
  it('callService should send response to callback', function() {
    var callback = sandbox.mock().withArgs(200, '..res..').atLeast(1);
    
    callService({method: 'GET', url: '/tasks'}, callback);
    xhr.requests[0].respond(200, {}, '..res..');
    
    callback.verify();
  });
//END:CALLSERVICE3

//START:CALLSERVICE3ERR
  it('callService should send error response to callback', function() {
    var callback = sandbox.mock().withArgs(404, '..err..').atLeast(1);
    
    callService({method: 'GET', url: '/tasks'}, callback);
    xhr.requests[0].respond(404, {}, '..err..');
    
    callback.verify();
  });
//END:CALLSERVICE3ERR

//START:CALLSERVICE4
  it('callService should only send when final response received', function() {
    var callback = sandbox.spy();
    callService({method: 'GET', url: '/tasks'}, callback);
    
    expect(callback.callCount).to.be.eql(0);
  });
//END:CALLSERVICE4

//START:ONLOAD1
  it('should register initpage handler with window onload', function() {
    expect(window.onload).to.be.eql(initpage);
  });
//END:ONLOAD1

//START:ONLOAD2  
  it('initpage should call getTasks', function(done) {
    sandbox.stub(window, 'getTasks', done);
    
    initpage();
  });
//END:ONLOAD2

//START:ADDTASK
  it('addTask should call callService', function(done) {
    sandbox.stub(window, 'callService', 
      function(params, callback) {
        expect(params.method).to.be.eql('POST');
        expect(params.url).to.be.eql('/tasks');
        expect(params.contentType).to.be.eql("application/json");
        
        var newTask = '{"name":"a new task","month":12,"day":11,"year":2016}';
        expect(params.data).to.be.eql(newTask);
        expect(callback).to.be.eql(updateMessage); 
        done();
      });
    
    addTask();
  });
//END:ADDTASK

//START:CALLSERVICE5_ADDTASK1
  it('callService should send data to the service', function() {
    callService({method: 'POST', url: '/tasks', data: '...some data...'});
      
    expect(xhr.requests[0].requestBody).to.be.eql('...some data...');
  });
//END:CALLSERVICE5_ADDTASK1

//START:CALLSERVICE5_ADDTASK2
  it('callService should have default content type', function() {
    callService({method: 'POST', url: '/tasks', data: '...some data...'});
        
    expect(
      xhr.requests[0].requestHeaders["Content-Type"]).contains("text/plain");
  });
//END:CALLSERVICE5_ADDTASK2  

//START:CALLSERVICE5_ADDTASK3
  it('callService should set content type if present', function() {
    callService({method: 'POST', url: '/tasks', data: '...some data...', 
      contentType: "whatever"});
      
    expect(
      xhr.requests[0].requestHeaders["Content-Type"]).contains("whatever");
  });
//END:CALLSERVICE5_ADDTASK3

//START:ADDTASK2A
  it('addTask callback should update message', function() {
    updateMessage(200, 'added');
  
    expect(domElements.message.innerHTML).to.be.eql('added (status: 200)');
  });
//END:ADDTASK2A

//START:ADDTASK2B  
  it('addTask callback should call getTasks', function() {
    var getTasksMock = sandbox.mock(window, 'getTasks');
  
    updateMessage(200, 'task added');
    getTasksMock.verify();
  });
//END:ADDTASK2B

//START:ADDTASK2C  
  it('initpage should register add task click event', function() {
    initpage();
    expect(domElements.submit.onclick).to.be.eql(addTask);
  });
//END:ADDTASK2C

//START:ADDTASK2D  
  it('addTask should return false', function() {
    expect(addTask()).to.be.false;
  });
//END:ADDTASK2D

//START:ADDTASK_CHECKTASK
  it(
   'addTask for invalid task: should skip callServiceMock call updateMessage',
    function() {
    var updateMessageMock = 
      sandbox.mock(window)
             .expects('updateMessage')
             .withArgs(0, 'invalid task');
  
    var callServiceMock = sandbox.spy(window, 'callService');
  
    sandbox.stub(window, 'validateTask')
           .returns(false);       
  
    addTask();
    updateMessageMock.verify();       
    expect(callServiceMock).to.not.be.called;
  });
//END:ADDTASK_CHECKTASK

//START:DELETETASK1
  it('updateTasks should add a link for delete', function() {
    updateTasks(200, responseStub);
  
    var expected = '<td>8/1/2016</td>' +
      '<td><A onclick="deleteTask(\'123412341201\');">delete</A></td>';
    expect(domElements.tasks.innerHTML).contains(expected);
  });
//END:DELETETASK1

//START:DELETETASK2
  it('deleteTask should call callService', function(done) {
    sandbox.stub(window, 'callService', function(params) {
      expect(params.method).to.be.eql('DELETE');
      expect(params.url).to.be.eql('/tasks/123412341203');
      done();
    });

    deleteTask('123412341203');
  });
//END:DELETETASK2
     
//START:DELETETASK3  
  it('deleteTask should register updateMessage', function() {
    var callServiceMock = sandbox.mock(window).
      expects('callService')
      .withArgs(sinon.match.any, updateMessage);
    
    deleteTask('123412341203');
    callServiceMock.verify();
  });
//END:DELETETASK3
//START:CANARY  
});
//END:CANARY
