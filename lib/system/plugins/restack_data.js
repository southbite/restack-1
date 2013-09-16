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
		
	   collection.find(this.transformToDb(criteria)).toArray(function(err, results) {
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
	transformAll: function(mongoObjects, options){
		
		var returnArray = [];
		
		for (var mongoObjectIndex in mongoObjects)
			returnArray.push(this.transform(mongoObjects[mongoObjectIndex], options));
		
		return returnArray;
		
	},
	transformToDbAll: function(schemaObjects, options){
		
		var returnArray = [];
		
		for (var schemaObjectIndex in schemaObjects)
			returnArray.push(this.transformToDb(schemaObjects[schemaObjectIndex], options));
		
		return returnArray;
		
	},
	transform:function(mongoObject, options) {
		
	    var transformed = mongoObject;
	    transformed.id = mongoObject._id.toString();
	    delete transformed._id;
	    return transformed;
	    
	},
	transformToDb:function(schemaObject, options){
		var transformed = schemaObject;
		
		if (schemaObject.id != undefined)
			transformed._id = ObjectID(schemaObject.id);
		
		delete transformed.id;
		
		if (options && options.excludeId)
			delete transformed._id;
		
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
	update_criteria:function(type, criteria, obj, options, done) {
		
		var collection =  this.internals.db.collection(type);
		
		if (options == null)
			options = {};
		
		options['multi'] = true;
		options['safe'] = true;
		options['upsert'] = false;
		
		collection.update(criteria, {$set: this.transformToDb(obj)}, options, function(err) {
		      if (!err)
		      {
		    	  collection.count(criteria, function(err, cnt){
		    		 done(err, cnt); 
		    	  });
		      }
		      else
		      {
		    	  done(err);
		      }
		 }.bind(this));
	},
	update:function(id, type, obj, options, done) {
		this.internals.db.collection(type).findAndModify({_id:ObjectID(id)}, [], {$set: this.transformToDb(obj, {excludeId:true})}, options, function(err, updatedObject) {
			done(err, updatedObject);
		}.bind(this));
	},
	destroy:function(id, type, options, done) {
		
		if (options && options.hard)
			this.update(id, type, {}, {remove:true}, function(err, deletedObject){
				done(err, deletedObject);
			}.bind(this));
		else
			this.update(id, type, {deleted:true}, null, function(err, deletedObject){
				done(err, deletedObject);
			}.bind(this));
		
	}
}

module.exports = data_helper;