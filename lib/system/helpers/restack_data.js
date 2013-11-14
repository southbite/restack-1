var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;
var ObjectID = require('mongodb').ObjectID;

var data_helper = {
	internals:{
		connectionURL:null,
		db:null,
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
			
			if (Array.isArray(mongoObject))
			{
				return this.transformAll(mongoObject, options);
			}
			else
			{
				var transformed = mongoObject;
			    transformed.id = mongoObject._id.toString();
			    delete transformed._id;
		
			    return transformed;
			}
		},
		transformToDb:function(schemaObject, options){
			
			if (Array.isArray(schemaObject))
				return this.transformToDbAll(schemaObject, options);
			else
			{
				var transformed = schemaObject;
				
				if (schemaObject.id != undefined)
					transformed._id = ObjectID(schemaObject.id);
				
				delete transformed.id;
				
				if (options && options.excludeId)
					delete transformed._id;
				
				if (options && options.excludeSystemVersion)
					delete transformed.systemVersion;
				
				return transformed;
			}
		}
	},
	connected:false,
	initialize:function(params, done)
	{
		//mongodb://127.0.0.1:27017/test
		//this.restack.log('init plugin');
		//this.restack.log(params);
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
		
	   collection.find(this.internals.transformToDb(criteria)).toArray(function(err, results) {
		   this.restack.log('got results');
		   this.restack.log(results);
		  
		   if (!err)
		   {
		    	if (results != null)
					done(null, this.internals.transform(results));
				else
					done(null);
		   }
		   else
			   done(err);
		   
	      }.bind(this)); 
	},
	create:function(type, data, done) {

		//changed to use internals db, we connect once when we initialize
		var collection = this.internals.db.collection(type);
		this.restack.log('transforming data:');
		//this.restack.log(data);
		var data = this.internals.transformToDb(data);
		this.restack.log('transformed');
		//this.restack.log(data);
		//transforming to the db schema
		collection.insert(data, function(err, result) {
			if (!err)
			{
				this.restack.log('created');
				//this.restack.log(result);
				done(null, this.internals.transform(result));
			}
			else
				done(err);
			
		}.bind(this));
		
	},
	update:function(type, criteria, data, options, done) {
		
		var collection =  this.internals.db.collection(type);
		
		if (options == null)
			options = {};
		
		options['multi'] = true;
		options['safe'] = true;
		options['upsert'] = false;
		
		data = this.internals.transformToDb(data, {excludeId:true, excludeSystemVersion:true});
		criteria = this.internals.transformToDb(criteria);
		
		collection.update(criteria, {$set: data, $inc: { systemVersion: 1 }}, options, function(err, updatedCount) {
		      if (!err)
		      {
		    	  done(err, updatedCount);
		      }
		      else
		      {
		    	  done(err);
		      }
		 }.bind(this));
	},
	remove:function(type, criteria, options, done) {
		
		criteria = this.internals.transformToDb(criteria);
		
		if (options && options.hard)
		{
			console.log('removing all');
			console.log(criteria);
			
			this.internals.db.collection(type).remove(criteria, null, function(err, deletedObjects){
				console.log('deletedObjects');
				console.log(deletedObjects);
				done(err, deletedObjects);
			}.bind(this));
			
		}
		else
			this.update(type, criteria, {deleted:true}, null, function(err, deletedObject){
				done(err, deletedObject);
			}.bind(this));
	}
}

module.exports = data_helper;