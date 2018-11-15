//START:REQUIRE
var MongoClient = require('mongodb').MongoClient;
//END:REQUIRE

//START:GET
module.exports = {
  connection: null,
  
  get: function() { return this.connection; },
//END:GET

//START:CLOSE1
//START:CLOSE
   close: function() {
//END:CLOSE1
     if(this.connection) {
       this.connection.close();
//START:CLOSE1
       this.connection = null;
//END:CLOSE1
     }
//START:CLOSE1
   },
//END:CLOSE
//END:CLOSE1

//START:CONNECT
  connect: function(dbname, callback) {
    var self = this;
  
    var cacheConnection = function(err, db) {
      self.connection= db;
      callback(err);
    };
  
    try {
      MongoClient.connect(dbname, cacheConnection);
    } catch(ex) {
      callback(ex);
    }
  }
//END:CONNECT
  
//START:GET
};
//END:GET
