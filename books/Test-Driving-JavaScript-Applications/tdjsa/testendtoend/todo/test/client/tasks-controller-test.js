//START:CANARY
describe('tasks controller tests', function() {
  // write canary test only if this is the first test 
  //for the front-end in this project
  it('should pass this canary test', function() {
    expect(true).to.be.true;
  });
//END:CANARY

  var controller;       
  var tasksServiceMock;
  var documentReadyHandler;

  beforeEach(module('todoapp'));

  beforeEach(inject(function($controller, $document) {
    $document.ready = function(handler) { documentReadyHandler = handler; };

    tasksServiceMock = {};

    controller = $controller('TasksController', {
      TasksService: tasksServiceMock
    });
  }));

//START:TASKEMPTY
  it('tasks should be empty on create', function() {
    expect(controller.tasks).to.be.eql([]);
  });
//END:TASKEMPTY

//START:MESSAGEEMPTY
  it('message should be empty on create', function() {
    expect(controller.message).to.be.eql('');
  });
//END:MESSAGEEMPTY

//START:GETTASKS
  it('getTasks should interact with the service', function(done) {
    controller.updateTasks = function() {};
    controller.updateError = function() {};
    
    tasksServiceMock.get = function(success, error) {
      expect(success).to.be.eql(controller.updateTasks);
      expect(error).to.be.eql(controller.updateError);
      done();
    };
    
    controller.getTasks();
  });
//END:GETTASKS

//START:UPDATE1
  it('updateTasks should update tasks', function() {
    var tasksStub = [{sample: 1}];
    controller.updateTasks(tasksStub);
    expect(controller.tasks).to.be.eql(tasksStub);
  });
//END:UPDATE1

//START:UPDATE2
  it('updateError should update message', function() {
    controller.updateError('Not Found', 404);
    expect(controller.message).to.be.eql('Not Found (status: 404)');
  });
//END:UPDATE2

//START:SORT1
  it('sortTasks should sort based on year', function() {
    var task1 = { name: 'task a', month: 1, day: 10, year: 2017};
    var task2 = { name: 'task b', month: 1, day: 10, year: 2016};
    
    var sorted = controller.sortTasks([task1, task2]);
    expect(sorted).to.be.eql([task2, task1]);
  });
//END:SORT1

//START:SORT2
  it('sortTasks should sort on year, then month', function() {
    var task1 = { name: 'task a', month: 2, day: 10, year: 2017};
    var task2 = { name: 'task c', month: 1, day: 10, year: 2016};
    var task3 = { name: 'task b', month: 1, day: 10, year: 2017};
    
    var sorted = controller.sortTasks([task1, task2, task3]);
    expect(sorted).to.be.eql([task2, task3, task1]);
  });
//END:SORT2

//START:SORT3
  it('sortTasks should sort on year, month, then day', function() {
    var task1 = { name: 'task a', month: 1, day: 20, year: 2017};
    var task2 = { name: 'task c', month: 1, day: 14, year: 2017};
    var task3 = { name: 'task b', month: 1, day: 9, year: 2017};
    
    var sorted = controller.sortTasks([task1, task2, task3]);
    expect(sorted).to.be.eql([task3, task2, task1]);
  });
//END:SORT3

//START:SORT4
  it('sortTasks should sort on year, month, day, then name', function() {
    var task1 = { name: 'task a', month: 1, day: 14, year: 2017};
    var task2 = { name: 'task c', month: 1, day: 14, year: 2017};
    var task3 = { name: 'task b', month: 1, day: 14, year: 2017};
    
    var sorted = controller.sortTasks([task1, task2, task3]);
    expect(sorted).to.be.eql([task1, task3, task2]);
  });
//END:SORT4

//START:SORT5
  it('updateTasks should call sortTasks', function() {
    var tasksStub = [{sample: 1}];
    
    controller.sortTasks = function(tasks) {
      expect(tasks).to.be.eql(tasksStub);
      return '..sorted..';
    };
    
    controller.updateTasks(tasksStub);
    expect(controller.tasks).to.be.eql('..sorted..');
  });
//END:SORT5

//START:READY
  it('should register getTasks as handler for document ready', function() {
    expect(documentReadyHandler).to.be.eql(controller.getTasks);
  });
//END:READY

//START:ADDTASK1
  it('newTask should have empty `name` and `date` on create', function() {
    expect(controller.newTask.name).to.be.eql('');
    expect(controller.newTask.date).to.be.eql('');
  });
//END:ADDTASK1

//START:ADDTASK2
  it('should convert newTask with no data to JSON format', function() {
    var newTask = controller.convertNewTaskToJSON();
    
    expect(newTask.name).to.be.eql('');
    expect(newTask.month).to.be.NAN;
    expect(newTask.day).to.be.NAN;
    expect(newTask.year).to.be.NAN;
  });
//END:ADDTASK2

//START:ADDTASK3  
  it('should convert newTask with data to JSON format', function() {
    var newTask = {name: 'task a', date: '6/10/2016'};    
    var newTaskJSON = {name: 'task a', month: 6, day: 10, year: 2016};

    controller.newTask = newTask;
    
    expect(controller.convertNewTaskToJSON()).to.be.eql(newTaskJSON);
  });
//END:ADDTASK3

//START:ADDTASK4
  it('addTask should call the service', function(done) {
    controller.updateMessage = function() {};
    controller.updateError = function() {};
    
    var convertedTask = controller.convertNewTaskToJSON(controller.newTask);

    tasksServiceMock.add = function(task, success, error) {
      expect(task).to.be.eql(convertedTask);
      expect(success).to.be.eql(controller.updateMessage);
      expect(error).to.be.eql(controller.updateError); 
      done();
    };

    controller.addTask();
  });
//END:ADDTASK4

//START:ADDTASK5
  it('updateMessage should update message and call getTasks', function(done) {
    controller.getTasks = function() { done(); };
    controller.updateMessage('good');
    expect(controller.message).to.be.eql('good');
  });
//END:ADDTASK5

//START:ADDTASK6  
  it('disableAddTask should make good use of validateTask', function() {
    var newTask = {name: 'task a', date: '6/10/2016'};    
    
    var originalValidateTask = window.validateTask;
    
    window.validateTask = function(task) {
      expect(task.name).to.be.eql(newTask.name);
      expect(
        task.month + '/' + task.day + '/' + task.year).to.eql(newTask.date);
      return true;
    };
    
    controller.newTask = newTask;
    
    var resultOfDisableAddTask = controller.disableAddTask();
    
    window.validateTask = originalValidateTask;
    
    expect(resultOfDisableAddTask).to.be.eql(false);
  });
//END:ADDTASK6

//START:DELETETASK
  it('deleteTask should delete and register updateMessage', function(done) {
    controller.updateMessage = function() {};
    controller.updateError = function() {};
    
    var sampleTaskId = '1234123412341234';                           
    
    tasksServiceMock.delete = function(taskId, success, error) {
      expect(taskId).to.be.eql(sampleTaskId);
      expect(success).to.be.eql(controller.updateMessage);
      expect(error).to.be.eql(controller.updateError);
      done();
    };
    
    controller.deleteTask(sampleTaskId);
  });
//END:DELETETASK
                        
//START:CANARY
});
//END:CANARY
