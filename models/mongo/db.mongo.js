const MongoClient = require('mongodb').MongoClient;


// Connection URL
const url = "mongodb://localhost:27017";
var dbName= "csc2008_hospital";
var db;

module.exports = {
    connectToServer: function( callback ) {
        MongoClient.connect(url, { useNewUrlParser: true },function(err, client) {
            db=client.db(dbName);
            return callback ( err );
        });
    },
    
    getDb: function() {
        return db;
    }
}