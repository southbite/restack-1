var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var ObjectID = require('mongodb').ObjectID;

var concurrency_helper = {
	internals:{
		async:null
	},
	initialize:function(params, done)
	{
		this.internals.async = require("async");
		done();
	},
	update:function(operation, done){
		
		this.restack.log('Doing concurrency update');
		this.restack.log(operation.data);
		var data = operation.data;
		
		var dataArray = [];
		if (!Array.isArray(data))
			dataArray.push(data);//turn it into an array so we dont repeat ourselves
		else
			dataArray = data;
		
		var versionUpdates = {};
		for (var itemIndex in dataArray)
		{
			var itemInstance = dataArray[itemIndex];
			versionUpdates[itemInstance.id] = itemInstance.systemVersion + 1;
		}
		
		operation.payload.versionUpdates = versionUpdates;
		this.restack.log(operation.payload);
		this.restack.log('Concurrency update done');
		
		done();
	},
	check:function(operation, done){
		var _this = this;
		
		var data = operation.data;
		var type = operation.type;
		
		var dataArray = [];
		if (!Array.isArray(data))
			dataArray.push(data);//turn it into an array so we dont repeat ourselves
		else
			dataArray = data;
		
		var concurrencyPassed = 'OK';
		
		for (var itemIndex in dataArray)
		{
			var itemInstance = dataArray[itemIndex];
			if (itemInstance.id == null || itemInstance.systemVersion == null)
			{
				concurrencyPassed = _this.restack.messagesHelper.concurrencyBadParameters();
				break;
			}
		}
		
		if (concurrencyPassed == 'OK')
		{
			_this.internals.async.forEach(dataArray, function(item, callback) { 
				
				//check concurrency for each item
				_this.restack.dataCacheHelper.find(type, {id:item.id}, function(e, results){
					
					if (!e && results.length == 1)
					{
						var foundSystemVersion = results[0].systemVersion;
						
						if (foundSystemVersion != item.systemVersion)
							callback(_this.restack.messagesHelper.concurrencyConflict(type, item.id, foundSystemVersion));
						else
							callback();
					}
					else
						callback(_this.restack.messagesHelper.concurrencyNotFound(type, item.id));//'Authentication failed: Invalid user-account header');
					
				});
				
		    }, function(err) {
		    	if (!err)
		    	{
		    		//console.log('iterate done');
		    		//console.log(payload);
		    		done(null);
		    	}
				else
					done(err);
		    });
		}
		else
			done(concurrencyPassed);
	}
}

module.exports = concurrency_helper;