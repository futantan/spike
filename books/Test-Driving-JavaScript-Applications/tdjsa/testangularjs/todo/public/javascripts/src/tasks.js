/*
//START:GETTASK1
var getTasks = function() {
  callService({method: 'GET', url: '/tasks'});
}

var callService = function() {}
//END:GETTASK1
*/ 

/*
//START:GETTASK2
var getTasks = function() {
  callService({method: 'GET', url: '/tasks'}, updateTasks);
}

var callService = function() {}
var updateTasks = function() {}
//END:GETTASK2
*/

var getTasks = function() {
  callService({method: 'GET', url: '/tasks'}, updateTasks);
};
  
/*
//START:CALLSERVICE1
var callService = function(options, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);
  xhr.send();
}
//END:CALLSERVICE1
*/                 

/*
//START:CALLSERVICE2 
var callService = function(options, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);

  xhr.onreadystatechange = function() {
    callback(xhr.status);
  }

  xhr.send();
}
//END:CALLSERVICE2
*/                 
        
/*
//START:CALLSERVICE3
var callService = function(options, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);

  xhr.onreadystatechange = function() {
    callback(xhr.status, xhr.response);
  }

  xhr.send();
}
//END:CALLSERVICE3
*/                 

/*
//START:CALLSERVICE4
var callService = function(options, callback) {
  var xhr = new XMLHttpRequest();

  xhr.open(options.method, options.url);

  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4)
      callback(xhr.status, xhr.response);
  }

  xhr.send();
}
//END:CALLSERVICE4
*/         

//START:CALLSERVICE
var callService = function(options, callback) {
  var xhr = new XMLHttpRequest();

  xhr.open(options.method, options.url);

  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4)
      callback(xhr.status, xhr.response);
  };

  xhr.setRequestHeader("Content-Type", options.contentType);

  xhr.send(options.data);
};
//END:CALLSERVICE
                
/*
//START:UPDATETASKS1
var updateTasks = function(status, response) {
  var message = response + ' (status: ' + status + ')';
  document.getElementById('message').innerHTML = message;
}
//END:UPDATETASKS1
*/                

/*
//START:UPDATETASKS2
var updateTasks = function(status, response) {
  if(status === 200) {
    var tasks = JSON.parse(response);
  
    document.getElementById('taskscount').innerHTML = tasks.length;
  } else {
    var message = response + ' (status: ' + status + ')';
    document.getElementById('message').innerHTML = message;
  }
}
//END:UPDATETASKS2
*/

/*
//START:UPDATETASK3
var updateTasks = function(status, response) {
  if(status === 200) {
    var tasks = JSON.parse(response);

    document.getElementById('taskscount').innerHTML = tasks.length;

    var row = function(task) {
      return '<tr><td>' + task.name + '</td>' +
        '<td>' + task.month + '/' + task.day + '/' +task.year + '</td>' +
        '</tr>';
    }           
    
    var table = '<table>' + tasks.map(row).join('') + '</table>';
    document.getElementById('tasks').innerHTML = table;        
  } else {
    var message = response + ' (status: ' + status + ')';

    document.getElementById('message').innerHTML = message;
  }
}
//END:UPDATETASK3
*/

//START:UPDATETASKS
var updateTasks = function(status, response) {
  if(status === 200) {
    var tasks = JSON.parse(response);

    document.getElementById('taskscount').innerHTML = tasks.length;

//START:UPDATETASKS_CHANGED    
    var row = function(task) {
      return '<tr><td>' + task.name + '</td>' +
        '<td>' + task.month + '/' + task.day + '/' +task.year + '</td>' +
        '<td><A onclick="deleteTask(\'' + task._id + '\');">delete</A></td>' +
        '</tr>';
    };
//END:UPDATETASKS_CHANGED    
    
    var table = '<table>' + tasks.map(row).join('') + '</table>';
    document.getElementById('tasks').innerHTML = table;        
  } else {
    var message = response + ' (status: ' + status + ')';
//START:GETELEMENT    
    document.getElementById('message').innerHTML = message;
//END:GETELEMENT    
  }
};
//END:UPDATETASKS

//START:UPDATEMESSAGE
var updateMessage = function(status, response) {
  document.getElementById('message').innerHTML = 
    response + ' (status: ' + status + ')';
  getTasks();
};                    
//END:UPDATEMESSAGE

/*
//START:INITPAGE1
var initpage = function() {
  getTasks();
}

window.onload = initpage;
//END:INITPAGE1
*/                

//START:INITPAGE
var initpage = function() {
  getTasks();
  document.getElementById('submit').onclick = addTask;
};              
//END:INITPAGE
           
/*
//START:ADDTASK1
var addTask = function() {
  var date = new Date(document.getElementById('date').value);
  var newTask = { 
    name: document.getElementById('name').value, 
    month: date.getMonth() + 1, 
    day: date.getDate(), 
    year: date.getFullYear() };
    
  callService({method: 'POST', url: '/tasks', 
    contentType: 'application/json', 
    data: JSON.stringify(newTask)}, updateMessage);
}

var updateMessage = function() {}
//END:ADDTASK1
*/

//START:ADDTASK
var addTask = function(fooback) {
  var date = new Date(document.getElementById('date').value);
  var newTask = { 
    name: document.getElementById('name').value, 
    month: date.getMonth() + 1, 
    day: date.getDate(), 
    year: date.getFullYear() 
  }; 

  if(validateTask(newTask)) {
    callService({method: 'POST', url: '/tasks', 
      contentType: 'application/json', 
        data: JSON.stringify(newTask)}, updateMessage);    
  } else {
    updateMessage(0, 'invalid task'); 
  }
  
  return false;
};
//END:ADDTASK

//START:DELETETASK
var deleteTask = function(taskId) {
  callService({method: 'DELETE', url: '/tasks/' + taskId}, updateMessage);
};
//END:DELETETASK

//START:READY
window.onload = initpage;
//END:READY