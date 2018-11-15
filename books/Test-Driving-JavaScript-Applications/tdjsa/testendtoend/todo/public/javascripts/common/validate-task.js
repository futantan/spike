/*
//START:INIT
var validateTask = function(task) {  
  return true;
}

//END:INIT
*/

/*
//START:TWO
var validateTask = function(task) {  
  if(task)
    return true;
  return false;
}
//END:TWO
*/

/*
//START:FOUR
var validateTask = function(task) {  
  if(task && task.name)
    return true;
  return false;
}
//END:FOUR
*/

/*
//START:SEVEN
var validateTask = function(task) {  
  if(task && task.name &&
    task.month && !isNaN(task.month))
    return true;
  return false;
}
//END:SEVEN
*/

//START:FINAL
var validateTask = function(task) {  
  if (task && task.name && 
    task.month && !isNaN(task.month) && 
    task.day && !isNaN(task.day) && 
    task.year && !isNaN(task.year))
    return true;
    
  return false;
};
//END:FINAL
//START:INIT
(typeof module !== 'undefined') && (module.exports = validateTask);
//END:INIT
