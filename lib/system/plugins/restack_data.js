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
		//console.log('init plugin');
		//console.log(params);
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
	find:function(type, criteria, done)
	{
	   var collection = this.internals.db.collection(type);
		
	   collection.find(criteria).toArray(function(err, results) {
		   console.log('got results');
		   console.log(results);
		   console.log(err);
			
		   if (!err)
		   {
		    	if (results != null)
					done(null, this.transformAll(results));
				else
					done(null);
		   }
		   else
			 done(err);
		   
	      }.bind(this)); 
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
		collection.findOne(this.transformToDb(criteria), function(err, result){
			if (!err)
			{
				if (result != null)
					done(null, this.transform(result));
				else
					done(null);
			}
			else
				done(err);
			
		}.bind(this));
		
	},
	transformAll: function(mongoObjects){
		
		var returnArray = [];
		
		for (var mongoObjectIndex in mongoObjects)
			returnArray.push(this.transform(mongoObjects[mongoObjectIndex]));
		
		return returnArray;
		
	},
	transformToDbAll: function(schemaObjects){
		
		var returnArray = [];
		
		for (var schemaObjectIndex in schemaObjects)
			returnArray.push(this.transform(schemaObjects[schemaObjectIndex]));
		
		return returnArray;
		
	},
	transform:function(mongoObject) {
		
	    var transformed = mongoObject;
	    transformed.id = mongoObject._id.toString();
	    delete transformed._id;
	    return transformed;
	    
	},
	transformToDb:function(schemaObject){
		var transformed = schemaObject;
		
		if (schemaObject.id != undefined)
			transformed._id = ObjectID(schemaObject.id);
		
		delete transformed.id;
		return transformed;
	},
	getById:function(type, id, done)
	{
		var collection = this.internals.db.collection(type);
		
		collection.findOne(this.transformToDb({id:id}), function(err, result){
			if (!err)
			{
				if (result != null)
					done(null, this.transform(result));
				else
					done(null);
			}
			else
				done(err);
			
		}.bind(this));
	},
	getAll:function(type, done)
	{
	   var collection = this.internals.db.collection(type);
		
	   collection.find().toArray(function(err, results) {
		   console.log('got results');
			console.log(results);
			console.log(err);
			
			if (!err)
			{
				if (results != null)
					done(null, this.transformAll(results));
				else
					done(null);
			}
			else
				done(err);
	      }.bind(this));      
		
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