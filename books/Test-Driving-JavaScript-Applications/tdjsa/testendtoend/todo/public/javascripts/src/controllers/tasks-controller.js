var TasksController = function(tasksService, $filter, $document) {
  var controller = this;  
  
  controller.tasks = [];
  controller.message = '';  

//START:INITNEWTASK                 
  controller.newTask = {name: '', date: ''};
//END:INITNEWTASK
  
  controller.getTasks = function() {
    tasksService.get(controller.updateTasks, controller.updateError);
  };

//START:UPDATETASKS
  controller.updateTasks = function(tasks) {
    controller.tasks = controller.sortTasks(tasks);
  };
//END:UPDATETASKS

//START:UPDATEERROR
  controller.updateError = function(error, status) {
    controller.message = error + ' (status: ' + status + ')';
  };                        
//END:UPDATEERROR

//START:SORT
  controller.sortTasks = function(tasks) {
    var orderBy = $filter('orderBy');
    return orderBy(tasks, ['year', 'month', 'day', 'name']);
  };
//END:SORT 

  $document.ready(controller.getTasks);

//START:CONVERT
  controller.convertNewTaskToJSON = function() {
    var dateParts = controller.newTask.date.split('/');
  
    return {
      name: controller.newTask.name,
      month: parseInt(dateParts[0]),
      day: parseInt(dateParts[1]),
      year: parseInt(dateParts[2])
    };
  };
//END:CONVERT

//START:ADDTASK
  controller.addTask = function() {
    tasksService.add(
      controller.convertNewTaskToJSON(controller.newTask),
      controller.updateMessage,
      controller.updateError);
  };
//END:ADDTASK                                           

//START:UPDATEMESSAGE
  controller.updateMessage = function(message) {
    controller.message = message;
    controller.getTasks();
  };
//END:UPDATEMESSAGE

//START:DISABLE
  controller.disableAddTask = function() {
    return !validateTask(controller.convertNewTaskToJSON());
  };
//END:DISABLE                                                       

//START:DELETETASK
  controller.deleteTask = function(taskId) {
    tasksService.delete(
      taskId, controller.updateMessage, controller.updateError);    
  };
//END:DELETETASK
};

angular.module('todoapp')
       .controller('TasksController', 
         ['TasksService', '$filter', '$document', TasksController]);