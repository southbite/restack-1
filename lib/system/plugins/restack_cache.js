//REMEMBER start yr redis server with the following policy, obviously you can use more than 20mb of memory...
//redis-server --maxmemory 20mb --maxmemory-policy volatile-lru

var cacheHelper = {
	internals:{
		redis:null,
		client:null,
		params:null,
		ip:null,
		port:null,
		async:null
	},
	initialize:function(params, done){
		try
		{

			this.internals.redis = require("redis");
			this.internals.async = require("async");

			if (params['dbKey'] == null)
				done('dbKey parameter is missing');

			if (params['ip'] == null)
				params.ip = '127.0.0.1';

			if (params['port'] == null)
				params.port = 6379;

			if (params['options'] == null)
				params.options = null;

			this.internals.params = params;
		    this.internals.client = this.internals.redis.createClient(this.internals.params.port, this.internals.params.ip, this.internals.params.options);

		    //////console.log('cacheHelper initialized');
		    //////console.log(this.internals.params);
		    
		    done(null);
		}
		catch(e)
		{
			done(e);
		}
	},
	find:function(params, done){
		var key = params.key;
		
		if (params.prepend == undefined || params.prepend == true)
			key = this.prependKey(params.key);
		
		console.log('finding');
		console.log(params);
		
		this.internals.client.get(key, function(err, item){
			
			console.log('found item: ');
			console.log(item);
			
			if (!err)
			{
				if (item != null)
				{
					var foundItem = JSON.parse(item);
					if (params.ttl != null && params.ttl > 0)
						this.setExpiry(key, params.ttl, function(e){
							if (!e)
								done(null, foundItem);
							else
								done('Found item, set expiry failed: ' + e);
								
						}.bind(this));
					else
						done(null, foundItem);
				}
				else
					done(null, null);
			}
			else
				done(err);
			
		}.bind(this));
	},
	findAll:function(params, done){
		this.iterate(params, function(key, effectedItem, payload, callback){
			try
			{
				payload.push(effectedItem);
				
				//console.log('doing callback in findAll');
				//console.log(payload);
				callback();
			}
			catch(e)
			{
				//console.log('doing callback in findAll:error ' + e);
				callback(e);
			}
		},
		function(e, effectedRecords){
			done(e, effectedRecords);
		});
	},
	iterate:function(params, operation, done){
		var collectionKey = this.prependKey(params.collection);
		var payload = [];
		
		this.internals.client.smembers(collectionKey, function(e, keys){
			if (!e)
			{
				if (keys != null && keys.length > 0)
				{
					this.internals.async.forEach(keys, function(key, callback) { 
						
						//console.log('iterated ');
						//console.log(JSON.stringify(keys));
						//console.log(JSON.stringify(params));
						//console.log(JSON.stringify(key));
						//console.log(JSON.stringify(params.collection));
						//console.log(JSON.stringify(params.ttl));
						
						this.find({collection:collectionKey, key:key, ttl:params.ttl, prepend:false}, function(e, item){
							
							if (!e)
							{
								//console.log(item);
								operation(key, item, payload, callback);
							}
							else
								done(e);
							
						});
				    }.bind(this), function(err) {
				    	if (!err)
				    	{
				    		//console.log('iterate done');
				    		//console.log(payload);
				    		done(null, payload);
				    	}
						else
							done(err);
				    });
					
				}
				else 
					done(null, []);
			}
			else
				done(e);
				
			
		}.bind(this));
	},
	updateAll:function(params, done){
		
		//////console.log('updating cache all');
		//////console.log(params);
		var totalCached = 0;
		
		this.internals.async.forEach(params.data, function(item, callback) { 
			
			////console.log('caching item found in async');
			////console.log(item);
			this.update({collection:params.collection, key:item[params.keyName], data:item, ttl:params.ttl}, function(e, put_response){
				
				if (!e)
				{
					//console.log('updated item: ' + item[params.keyName]);
					totalCached++;
					callback();
				}
				else
					callback(e);
			});
			
	    }.bind(this), function(err) {
	    	
	    	if (!err)
	    	{
	    		done(null, totalCached);
	    	}
			else
				done(err, totalCached);
	    	
	    });
	},
	update:function(params, done){
		
		var	collectionKey = this.prependKey(params.collection);
		key = this.prependKey(params.key);
		var item = JSON.stringify(params.data);
		
		try
		{
			var setParameters = [key, item];
			var saddParameters = [collectionKey, key];
			
			if (params.ttl > 0)
				setParameters = [key, item, 'EX', params.ttl];
			
			//console.log('setParameters');
			//console.log(setParameters);
			
			this.internals.client.set(setParameters, function(e, response){
				
				if (!e)
				{
					//console.log(saddParameters);
					//console.log('saddParameters');
					this.internals.client.sadd(saddParameters, function(sadd_e, sadd_response){
						
						if (!sadd_e)
						{
							done(null, response);
						}
						else
							done(sadd_e);
							
					}.bind(this));

				}
				else
				{
					//console.log('something broke setting following: ');
					//console.log(setParameters);
					done(e);
				}
					
				
			}.bind(this));
		}
		catch(e)
		{
			this.restack.log('Failure in cache update: ' + e);
			done(e);
		}
	},
	prependKey:function(key)
	{
		return this.internals.params['dbKey'] + '_' + key;
	},
	setExpiry:function(key, ttl, done)
	{
		this.internals.client.expire(key, ttl, done);
	},
	statics:{},
	clearAll:function(params, done){
		
		this.iterate(params, function(key, effectedItem, payload, callback){
			try
			{
				console.log('clearing');
				console.log({collection:params.collection, key:key, prepend:false});
				console.log(this);
				
				this.clear({collection:params.collection, key:key, prepend:false}, function(e, result){
					if (!e && result == 'OK')
					{
						console.log('item cleared: ');
						payload.push(key);
						console.log('item cleared: ' + key);
						callback();
					}
					else
					{
						console.log('Error clearing item from cache:');
						done('Error clearing item from cache: ' + e + ', result: ' + result);
					}
				});
			}
			catch(e)
			{
				console.log('error in multiple clear ' + e);
				done(e);
			}
		}.bind(this), 
		function(e, payload){
			done(e, payload.length);
		}.bind(this));
	},
	clear:function(params, done){
		
		console.log('single clear');
		var	collectionKey = this.prependKey(params.collection);
		var	key = params.key;
		
		if (params.prepend == null || params.prepend == true)
			key = this.prependKey(params.key);

		var sremParameters = [collectionKey, key];
		
		try
		{
			this.internals.client.srem(sremParameters, function(e){
				if (!e)
					this.internals.client.del(key, function(e){
						if (!e)
							done(null, 'OK');
						else
							done(e);
					}.bind(this));
				else
					done(e);
			}.bind(this));
		}
		catch(e)	
		{
			done(e);
		}
	}
}

module.exports = cacheHelper;