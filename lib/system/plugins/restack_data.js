var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;
var ObjectID = require('mongodb').ObjectID;


var data_helper = {
	internals:{
		connectionURL:null,
		db:null
	},
	connected:false,
	initialize:function(params, done)
	{
		//mongodb://127.0.0.1:27017/test
		
		//we have an internals property, holds plugin specific methods and data
		this.internals.connectionURL = params.connectionURL;
		
		MongoClient.connect(this.internals.connectionURL, function(err, db) {
			if (err)
				done(err);
			else
			{
				//the internals db is set here, used by the rest of the class methods
				this.internals.db = db;
				done();
			}
	    }.bind(this));
	},
	getType:function(type, done){
		done('Not implemented');
	},
	find:function(type, criteria, done)
	{
		done('Not implemented');
	},
	findIn:function(type, columnName, matchValues, done)
	{
		done('Not implemented');
	},
	findOne:function(type, criteria, done)
	{
		//changed to use internals db, we connect once when we initialize
		var collection = this.internals.db.collection(type);
		
		//using the findOne, with criteria - use the transformToDb function to replace id with ObjectID
		collection.findOne(transformToDb(criteria), function(err, result){
			if (!err)
			{
				console.log('found result for id: ' + result._id.toString());
				//'this' works - because we bound the function to 'this' in line 55
				done(null, this.transform(result));
			}
			else
				done(err);
			
		}.bind(this));
		
		/*
	    var self=this;
	
	    MongoClient.connect(this.internals.connectionURL, function(err, db) {
	      if(err) done(err);
	
	      var collection = db.collection(type);
	      var idString = criteria.id;
	      collection.findOne({_id: ObjectID(idString)}, function(err, result) {
	        console.log('found result for id: '+idString);
	        done(err, self.transform(result));
	      });  // ok
	    });
	    
	    */
	},
	transform:function(mongoObject) {
	    var transformed = mongoObject;
	    transformed.id = mongoObject._id.toString();
	    delete transformed._id;
	    return transformed;
	},
	transformToDb:function(schemaObject){
		var transformed = schemaObject;
		transformed._id = ObjectID(schemaObject.id);
		delete transformed.id;
		return transformed;
	},
	getById:function(type, id, done)
	{
    console.log('get by id!');
		done('Not implemented');
	},
	getAll:function(type, done)
	{
		done('Not implemented');
	},
	create:function(type, obj, done) {

		//changed to use internals db, we connect once when we initialize
		var collection = this.internals.db.collection(type);
		
		//transforming to the db schema
		collection.insert(this.transformToDb(obj), function(err, result) {
			if (!err)
				done(null, this.transform(result[0]));
			else
				done(err);
		}.bind(this));
		
	/*
    var self=this;

    MongoClient.connect(this.internals.connectionURL, function(err, db) {

      if(err) throw done(err);

      var collection = db.collection(type);
      collection.insert(obj, function(err, result) {
        done(err, self.transform(result[0]));
      });
    });
    
    */
	},
	update_criteria:function(type, criteria, obj, done) {
		done('Not implemented');
	},
	update:function(id, type, obj, done) {
		done('Not implemented');
	},
	destroy:function(type, id, done) {
		done('Not implemented');
	}
}

module.exports = data_helper;