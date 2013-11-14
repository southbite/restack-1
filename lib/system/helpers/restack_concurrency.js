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
	check:function(type, data, done){
		var _this = this;
		
		var dataArray = [];
		if (!Array.isArray(data))
			dataArray.push(data);//turn it into an array so we dont repeat ourselves
		else
			dataArray = data;
		
		var concurrencyPassed = 'OK';
		
		for (var item in dataArray)
		{
			if (item.id == null || item.systemVersion == null)
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