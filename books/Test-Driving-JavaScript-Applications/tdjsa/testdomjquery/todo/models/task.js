//START:ALL
var db = require('../db');
var ObjectId = require('mongodb').ObjectId;
//END:ALL
//START:VALIDATE
var validateTask = require('../public/javascripts/common/validate-task');
//END:VALIDATE
//START:ALL

var collectionName = 'tasks';

module.exports = {
  all: function(callback) {
    db.get().collection(collectionName).find().toArray(callback);
  },

//END:ALL

//START:GET
  get: function(taskId, callback) {
    db.get().collection(collectionName)
      .find({'_id': new ObjectId(taskId)}).limit(1).next(callback);
  },
//END:GET

//START:ADD1
  validate: validateTask,
//END:ADD1

//START:ADD  
//START:ADD_POSITIVE
//START:ADD_DUPLICATE
  add: function(newTask, callback) {
//END:ADD_DUPLICATE
//END:ADD_POSITIVE 
//START:ADD_DUPLICATE

    var found = function(err, task) {
      if(task)
        callback(new Error('duplicate task'));
      else
//START:ADD_POSITIVE
        db.get().collection(collectionName).insertOne(newTask, callback);
//END:ADD_POSITIVE
   };                  
   
//END:ADD_DUPLICATE
//START:ADD2
//START:ADD3
    if(this.validate(newTask))
//START:ADD_DUPLICATE
      db.get().collection(collectionName).find(newTask).limit(1).next(found);
//END:ADD_DUPLICATE
//END:ADD2
    else
      callback(new Error("unable to add task"));
//END:ADD3
//START:ADD_POSITIVE
//START:ADD_DUPLICATE
  },
//END:ADD_DUPLICATE
//END:ADD_POSITIVE
//END:ADD  
               
//START:DELETE
//START:DELETE1
  delete: function(taskId, callback) {
    var handleDelete = function(err, result) {
//END:DELETE1
      if(result.deletedCount != 1)
        callback(new Error("unable to delete task with id: " + taskId));
      else
//START:DELETE1
        callback(null);      
    };

    db.get().collection(collectionName)
      .deleteOne({'_id': new ObjectId(taskId)},  handleDelete);
  },
//END:DELETE1 
//END:DELETE
//START:ALL
};
//END:ALL
