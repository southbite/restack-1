var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var ObjectID = require('mongodb').ObjectID;

var concurrency_helper = {
	internals:{
		
	},
	initialize:function(params, done)
	{
		done();
	},
	check:function(type, dataArray, done){
		
		done();
	}
}

module.exports = concurrency_helper;