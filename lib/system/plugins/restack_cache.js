
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
		    
		    done(null);
		}
		catch(e)
		{
			done(e);
		}
	},
	putAllVolatile:function(objectKeyPropertyName, items, ttl, done){
		this.putAllInternal(null, objectKeyPropertyName, items, 'lru', ttl, done);
	},
	putAllStatic:function(objectKeyPropertyName, items, done){
		this.putAllInternal(null, objectKeyPropertyName, items, 'static', 0, done);
	},
	putCollectionStatic:function(collectionKey, objectKeyPropertyName, collectionItems, done){
		this.putAllInternal(collectionKey, objectKeyPropertyName, collectionItems, 'static', 0, done);
	},
	putCollectionVolatile:function(collectionKey, objectKeyPropertyName, collectionItems, ttl, done){
		this.putAllInternal(collectionKey, objectKeyPropertyName, collectionItems, 'lru', ttl, done);
	},
	putAllInternal:function(collectionKey, objectKeyPropertyName, collectionItems, cacheConfig, ttl,  done){
		// loads a collection of objects statically into memory - these guys are never removed
		var totalCached = 0;
		var cacheCount = collectionItems.length;
		
		////console.log('putting all');
		////console.log(collectionItems);
		
		var cacheObject = function(obj, cacheObjectDone)
		{
			try
			{
				////console.log('putting');
				this.putInternal(collectionKey, obj[objectKeyPropertyName], obj, cacheConfig, ttl, function(e, put_response){
						cacheObjectDone(e);
				});
				
			}
			catch(e)
			{
				cacheObjectDone(e);
			}
		}.bind(this);
		
		//caches all objects by a specific type
		for (var schemaObjectIndex in collectionItems)
		{
			////console.log('caching object');
			
			cacheObject(collectionItems[schemaObjectIndex], function(e, resp){
				
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
	getVolatile:function(key, ttl, done){
		this.getInternal(key, 'lru', ttl, true, done);
	},
	getStatic:function(key, done){
		this.getInternal(key, 'static', 0, true, done);
	},
	getInternal:function(key, cacheConfig, ttl, prependKey, done){
		
		//console.log('getting ' + key);
		
		//console.log(done);
		
		if (cacheConfig == null)
			cacheConfig = 'lru';
		
		if (ttl == null)
			ttl = 0;
		
		if (prependKey)
			key = this.prependKey(key, cacheConfig);
		
		//console.log('getting ' + key);
		
		this.internals.client.get(key, function(err, item){
			
			if (!err)
			{
				if (item != null)
				{
					if (ttl > 0)
						this.setExpiry(key, ttl, function(e){
							
							if (!e)
								done(null, JSON.parse(item));
							else
								done('Found item, set expiry failed: ' + e);
							
						}.bind(this));
					else
						done(null, JSON.parse(item));
				}
				else
					done(null, null);
				
			}
			else
				done(err);
			
			
		}.bind(this));
		
	},
	getCollectionVolatile:function(collectionKey, ttl,  done){
		this.getAllInternal(collectionKey, 'lru', ttl, done);
	},
	getCollectionStatic:function(collectionKey, done){
		this.getAllInternal(collectionKey, 'static', 0, done);
	},
	getAllInternal:function(collectionKey, cacheConfig, ttl, done)
	{
		////console.log('getting ');
		
		if (cacheConfig == null)
			cacheConfig = 'lru';
		
		var key = this.prependKey(collectionKey, cacheConfig);
		
		////console.log('getting ' + key);
		
		this.internals.client.smembers(key, function(e, resp){
			
			////console.log('smembers e');
			////console.log(e);
			
			if (!e)
			{
				//console.log('smembers');
				//console.log(resp);
				
				if (resp != null && resp.length > 0)
				{
					var allCollectionItems = [];
					
					////console.log('resp.len');
					////console.log(resp.length);
					
					this.internals.async.forEach(resp, function(respItem, callback) { //The second argument (callback) is the "task callback" for a specific messageId
						
						////console.log('fetching single: ' + respItem);
						////console.log(resp);
						//(key, cacheConfig, ttl, done)
						this.getInternal(respItem, cacheConfig, ttl, false, function(e, item){
							
							if (!e)
							{
								//console.log('fetched single ' + respItem);
								//console.log(item);
								
								if (item != null)
									allCollectionItems.push(item);
								
								callback(e);
								////console.log('fetched single pushed');
							}
							else
								callback(e);
							
						});
				    }.bind(this), function(err) {
				    	if (!err)
				    	{
				    		////console.log('got all items');
				    		////console.log(allCollectionItems);
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
		
		
		
	},
	putVolatile:function(collectionKey, key, item, ttl, done)
	{
		this.putInternal(null, key, item, 'lru', ttl, function(e, resp){
			done(e, resp);
		});
		
	},
	putStatic:function(collectionKey, key, item, done)
	{
		this.putInternal(collectionKey, key, item, cacheConfig, ttl, function(e, resp){
			done(e, resp);
		});
		
	},
	putInternal:function(collectionKey, key, item, cacheConfig, ttl, done)
	{
		var response = {};
		
		response.key = key;
		response.collectionKey = collectionKey;
		
		if (collectionKey != null)
			collectionKey = this.prependKey(collectionKey, cacheConfig);
		
		key = this.prependKey(key, cacheConfig);
		
		if (cacheConfig == null)
			cacheConfig = 'lru';
		
		if (cacheConfig == 'lru' && (ttl == null || ttl <= 0))
			done('please set the ttl (time to live in milliseconds) if you wish to use the least recently used caching configuration');
		else
		{
			if (ttl == null)
				ttl = 0;//forever
			
			item = JSON.stringify(item);
			
			response.redisKey = key;
			response.redisCollectionKey = collectionKey;
			response.ttl = ttl;
			response.cacheConfig = cacheConfig;
			
			////console.log('done put');
			////console.log(done);
			try
			{
				var setParameters = [key, item];
				
				if (ttl != null && ttl > 0)
					setParameters = [key, item, 'EX', ttl];
				
				this.internals.client.set(setParameters, function(e, response){
					
					//console.log('single set');
					//console.log(setParameters);
					////console.log(e);
					
					if (!e)
					{
							
						if (collectionKey != null)
						{
							var saddParameters = [collectionKey, key];

							this.internals.client.sadd(saddParameters, function(sadd_e, sadd_response){
								
								//console.log('sadd ' + collectionKey);
								//console.log('sadd ' + key);
								////console.log(sadd_e);
								
								if (!sadd_e)
								{
									done(null, response);
								}
								else
									done(sadd_e);
									
							}.bind(this));
						}
						else
							done(null, response);

						
						/*
						if (ttl > 0)
							this.setExpiry(key, ttl, function(e, expiry_response){
								if (!e)
								{
									sadd();
								}
								else
									done('Key set OK, expiry set failed: ' + e);
								
							});
						else
					
							sadd();
								*/
					}
					else
						done(e);
					
				}.bind(this));
			}
			catch(e)
			{
				done(e, response);
			}
		}
		
	},
	prependKey:function(key, cacheConfig)
	{
		return this.params['dbKey'] + '_' + cacheConfig + '_' + key;
	},
	setExpiry:function(key, ttl, done)
	{
		this.internals.client.expire(key, ttl, done);
	}
}

module.exports = cacheHelper;