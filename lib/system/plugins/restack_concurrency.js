var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var ObjectID = require('mongodb').ObjectID;

var concurrency_helper = {
	internals:{
		
	},
	initialize:function(params, done)
	{
		done();
	},
	check:function(type, data, done){
		done();
	},
	update:function(type, data, done){
		done();
	}
}

module.exports = concurrency_helper;