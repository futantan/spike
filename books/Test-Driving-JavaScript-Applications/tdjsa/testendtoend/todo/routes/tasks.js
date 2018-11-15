//START:GET_PATH
var express = require('express');
var task = require('../models/task');

var router = express.Router();

//END:GET_PATH
/*
//START:GET_PATH
router.get('/', undefined);

//END:GET_PATH
*/

//START:GET
router.get('/', function(req, res, next) {
  task.all(function(err, tasks) {
    res.send(tasks);
  });
});
//END:GET

//START:GET_ID
router.get('/:id', function(req, res, next) {
  task.get(req.params.id, function(err, task) {
    if(task)
      res.send(task);
    else
      res.send({});
  });
});
//END:GET_ID

//START:POST
router.post('/', function(req, res, next) {
  task.add(req.body, function(err) {
    if(err)
      res.send(err.message);
    else
      res.send('task added');
  });
});
//END:POST

//START:DELETE
router.delete('/:id', function(req, res, next) {
  task.delete(req.params.id, function(err) {
    if(err)
      res.send(err.message);
    else
      res.send('task deleted');
  });
});
//END:PATH

//START:GET_PATH  
module.exports = router;
//END:GET_PATH
