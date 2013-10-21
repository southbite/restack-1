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

		    console.log('cacheHelper initialized');
		    console.log(this.internals.params);
		    
		    done(null);
		}
		catch(e)
		{
			done(e);
		}
	},
	find:function(params, done){
		
		var key = this.prependKey(params.key);
		
		this.internals.client.get(key, function(err, item){
			
			if (!err)
			{
				if (item != null)
					this.setExpiry(key, params.ttl, function(e){
						
						if (!e)
							done(null, JSON.parse(item));
						else
							done('Found item, set expiry failed: ' + e);
							
					}.bind(this));
				else
					done(null, null);
			}
			else
				done(err);
			
		}.bind(this));
	},
	findAll:function(params, done){
		
		this.iterate(params.collection, function(key, effectedItem, payload, callback){
			try
			{
				if (payload == null)
					payload = [];
				
				payload.push(effectedItem);
				callback();
			}
			catch(e)
			{
				callback(e);
			}
		}, 
		function(e, effectedRecords){
			done(e, effectedRecords);
		});
		
		/*
		var key = this.prependKey(params.collection);
		
		this.internals.client.smembers(key, function(e, keys){
			if (!e)
			{
				if (keys != null && keys.length > 0)
				{
					var allCollectionItems = [];
					this.async.forEach(keys, function(key, callback) { 
						this.find({collection:params.collection, key:key, ttl:params.ttl}, function(e, item){
							
							if (!e)
							{
								if (item != null)
									allCollectionItems.push(item);
								
								callback();
							}
							else
								callback(e);
							
						});
				    }.bind(this), function(err) {
				    	if (!err)
				    	{
				    		done(null, allCollectionItems);
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
		
		*/
	},
	iterate:function(collection, operation, done){
		var key = this.prependKey(collection);
		var payload = null;
		
		this.internals.client.smembers(key, function(e, keys){
			if (!e)
			{
				if (keys != null && keys.length > 0)
				{
					this.async.forEach(keys, function(key, callback) { 
						this.find({collection:params.collection, key:key, ttl:params.ttl}, function(e, item){
							
							if (!e)
							{
								item = JSON.parse(item);
								
								operation(key, item, payload, function(e){
									
									callback(e);
									
								}.bind(this));
								
							}
							else
								callback(e);
							
						});
				    }.bind(this), function(err) {
				    	if (!err)
				    	{
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
		
		console.log('updating cache all');
		console.log(params);
		
		var totalCached = 0;
		var cacheCount = params.data.length;
		
		var cacheObject = function(obj, cacheObjectDone)
		{
			try
			{
				console.log('params in cacheObject');
				console.log(params);
				
				this.update({collection:params.collection, key:obj[params.keyName], data:obj, ttl:params.ttl}, function(e, put_response){
						cacheObjectDone(e);
				});
				
			}
			catch(e)
			{
				cacheObjectDone(e);
			}
		}.bind(this);
		
		//caches all objects by a specific type
		for (var itemIndex in params.data)
		{
			console.log('caching object data');
			console.log(params.data);
			
			cacheObject(params.data[itemIndex], function(e, resp){
				
				if (!e)
				{
					totalCached++;
					
					if (totalCached == cacheCount)
						done(null);
				}
				else 
					done(e);
				
			});
		}
	},
	update:function(params, done){
		
		console.log('single update');
		console.log(params);
		
		var	collectionKey = this.prependKey(params.collection);
		key = this.prependKey(params.key);
		var item = JSON.stringify(params.data);
			
		console.log('updating cache');
		console.log(collectionKey);
		console.log(key);
		console.log(item);
		
		try
		{
			var setParameters = [key, item];
			
			if (params.ttl > 0)
				setParameters = [key, item, 'EX', params.ttl];
			
			this.internals.client.set(setParameters, function(e, response){
				if (!e)
				{
					var saddParameters = [collectionKey, key];

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
					done(e);
				
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
		
		var clearedCount = 0;
		
		this.iterate(params.collection, function(key, effectedItem, payload, callback){
			try
			{
				if (payload == null)
					payload = 0;
				
				this.clear({collection:params.collection, key:key}, function(e){
					if (!e)
						payload++;

					callback(e);
				});
				
			}
			catch(e)
			{
				callback(e);
			}
		}, 
		function(e, payload){
			done(e, payload);
		});
	},
	clear:function(params, done){
		
		var	collectionKey = this.prependKey(params.collection);
		var	key = this.prependKey(params.key);
		
		try
		{
			var sremParameters = [collectionKey, key];
			
			this.internals.client.srem(sremParameters, function(e){
				if (!e)
					this.internals.client.del(key, function(e){
						done(e);
					});
				else
					done(e);
			});
		}
		catch(e)	
		{
			done(e);
		}
	}
}

module.exports = cacheHelper;