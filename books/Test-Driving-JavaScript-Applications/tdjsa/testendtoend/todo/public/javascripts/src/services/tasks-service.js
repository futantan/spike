//START:SETUP
var TasksService = function($http) {
  var service = this;
//END:SETUP
  
//START:GET
  service.get = function(success, error) {
    $http.get('tasks')
         .success(success)
         .error(error);
  };
//END:GET

//START:ADD  
  service.add = function(task, success, error) {
    $http.post('tasks', task)
         .success(success)
         .error(error);
  };
//END:ADD

//START:DELETE
  service.delete = function(taskId, success, error) {
    $http.delete('tasks/' + taskId)
         .success(success)
         .error(error);
  };
//END:DELETE
//START:SETUP
};
//END:SETUP
       
//START:SETUP
angular.module('todoapp')
       .service('TasksService', ['$http', TasksService]);
//END:SETUP
       