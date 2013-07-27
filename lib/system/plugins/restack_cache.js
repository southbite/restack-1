
//REMEMBER start yr redis server with the following policy, obviously you can use more than 20mb of memory...
//redis-server --maxmemory 20mb --maxmemory-policy volatile-lru

var cacheHelper = {
	internals:{},
	initialize:function(params, done){
		//done('Not implemented');
		done();
	},
	putAllVolatile:function(objectKeyPropertyName, items, ttl, done){
		done('Not implemented');
	},
	putAllStatic:function(objectKeyPropertyName, items, done){
		done('Not implemented');
	},
	putCollectionStatic:function(collectionKey, objectKeyPropertyName, collectionItems, done){
		done('Not implemented');
	},
	putCollectionVolatile:function(collectionKey, objectKeyPropertyName, collectionItems, ttl, done){
		done('Not implemented');
	},
	putAllInternal:function(collectionKey, objectKeyPropertyName, collectionItems, cacheConfig, ttl,  done){
		done('Not implemented');
	},
	getVolatile:function(key, ttl, done){
		done('Not implemented');
	},
	getStatic:function(key, done){
		done('Not implemented');
	},
	getInternal:function(key, cacheConfig, ttl, prependKey, done){
		done('Not implemented');
	},
	getCollectionVolatile:function(collectionKey, ttl,  done){
		done('Not implemented');
	},
	getCollectionStatic:function(collectionKey, done){
		done('Not implemented');
	},
	getAllInternal:function(collectionKey, cacheConfig, ttl, done)
	{
		done('Not implemented');
	},
	putVolatile:function(collectionKey, key, item, ttl, done)
	{
		done('Not implemented');
	},
	putStatic:function(collectionKey, key, item, done)
	{
		done('Not implemented');
	},
	putInternal:function(collectionKey, key, item, cacheConfig, ttl, done)
	{
		done('Not implemented');
	},
	prependKey:function(key, cacheConfig)
	{
		
	},
	setExpiry:function(key, ttl, done)
	{
		done('Not implemented');
	}
}

module.exports = cacheHelper;