var cache =  {
		check:function(req,res,next){
		
			req.operation.cache = {hit:false};
			
			if (!this.restack.settings.operational.cache_up)
				next();
			else
			{
				//NB: if we are putting, would be nice to grab the previous item from the cache and add it to the operation stream
				//ignore previous comment for now - will just complicate the design
				
				if (['GET'].indexOf(req.method) == 0)
				{
					var model = this.restack.schema.getModel(req.operation.type);
					
					if (model.directives.cacheTTLMinutes >= 0)
					{
						//TODO modify log call to work like this:
						this.restack.log({msg:'checking cache....',level:0, notify:false, module:'cache middleware'});
						
						if (req.operation.criteria.id != null && Object.keys(req.operation.criteria).length == 1)
						{
							//we getting by id
							this.restack.log({msg:'getting by id...',level:0, notify:false, module:'cache middleware'});
							this.restack.cachePlugin.find({collection:req.operation.type, key:req.operation.criteria.id, ttl:(model.directives.cacheTTLMinutes * 60000)}, function(e, found){
								
								if (!e)
								{
									this.restack.log({msg:'cache hit....' + JSON.stringify(found),level:0, notify:false});
									
									if (found != null)
									{
										req.operation.cache.hit = true;
										req.operation.payload = [found];
									}
									next();
								}
								else
									this.failed(e, false, next);//we move on - log a cache error, but have no cache hit - so the cache degrades gracefully
							});
						}
						else if ((Object.keys(req.operation.criteria).length == 0) || (req.operation.criteria["deleted"] != null && Object.keys(req.operation.criteria).length == 1) && this.restack.cachePlugin.statics[req.operation.type] == true)
						{
							this.restack.log({msg:'getting all by type...',level:0, notify:false});
							//we getting all because everything is statically loaded
							this.restack.cachePlugin.findAll({collection:req.operation.type, key:null, ttl:model.directives.cacheTTLMinutes * 60000}, function(e, found){
								
								if (!e)
								{
									if (found.length > 0)
									{
										req.operation.cache.hit = true;
										req.operation.payload = found;
									}
										
									next();
								}
								else
									this.failed(e, false, next);//we move on - log a cache error, but have no cache hit - so the cache degrades gracefully
								
							});
						}
						else
							next();
						
					}
					else
						next();
				}
				else
					next();
			}
			
		},
		update:function(req, res, next)
		{
			this.restack.log('update cache happening: ' + JSON.stringify(req.operation.criteria));
			
			if (!this.restack.settings.operational.cache_up)
				next();
			else
			{
				var model = this.restack.schema.getModel(req.operation.type);
				
				if (model.directives.cacheTTLMinutes >= 0 && req.operation.payload.length > 0)
				{
					//we are caching for this item, and we have a payload
					this.restack.log('updating cache for possible statics....');
					this.restack.log(JSON.stringify(req.operation.criteria));
					
					if (req.operation.cache.hit)
						next();//because we fetched this successfully from the cache
					else if (req.method == 'GET' && (Object.keys(req.operation.criteria).length == 0 || (req.operation.criteria["deleted"] != null && Object.keys(req.operation.criteria).length == 1)))
					{
						this.restack.log('updating cache for getall....');
						//so no hit - but we have a payload for a successful getall, which we will push to cache
						this.restack.cachePlugin.updateAll({collection:req.operation.type, keyName:'id', data:req.operation.payload, ttl:model.directives.cacheTTLMinutes * 60000}, function(e){
							
							if (!e)
							{
								//means we got everything, and it is statically cached
								this.restack.cachePlugin.statics[req.operation.type] = true;
								next();
							}
							else
								this.failed(e, false, next);
							
						});
					}
					else if (req.method == 'GET' && Object.keys(req.operation.criteria).length == 1 && req.operation.criteria.id != null)
					{
						//getting by id
						//so no hit - but we have a payload, which we will push to cache
						this.restack.log('pushing single get to cache');
						this.restack.cachePlugin.update({collection:req.operation.type, keyName:'id', data:req.operation.payload, ttl:model.directives.cacheTTLMinutes * 60000}, function(e){
							if (!e)
								next();
							else
								this.failed(e, false, next);
						});
					}
					else if (req.method == 'DELETE' && Object.keys(req.operation.criteria).length == 1 && req.operation.criteria.id != null)
						//single delete so we can remove the item from the cache
						this.restack.cachePlugin.clear({collection:req.operation.type, key:req.operation.criteria.id}, function(e){
							if (!e)
								next();
							else
								this.failed(e, false, next);
						});
					else if (req.method == 'POST' && req.operation.payload.length > 0)
					{
						this.restack.log('pushing post to cache');
						this.restack.log(req.operation.payload);
						//inserts pass back the new items as part of the payload, so we can update the cache
						this.restack.cachePlugin.updateAll({collection:req.operation.type, keyName:'id', data:req.operation.payload, ttl:model.directives.cacheTTLMinutes * 60000}, function(e){
							if (!e)
								next();
							else
								this.failed(e, false, next);
						});
					}
					else {
						//for all multiple PUT, POST, DELETE - clear the getall cache
						this.restack.cachePlugin.statics[req.operation.type] = false; //do this regardless because it is true that the data has changed
						this.restack.cachePlugin.clearCollection({collection:req.operation.type}, function(e){
							if (!e)
								next();
							else
								this.failed(e, false, next);
						});
					}
				}
				else
					next();
			
			}
		},
		failed:function(e, breakRequest, next)
		{
			this.restack.settings.operational.cache_up = false;
			var errorMsg = 'Cache failure: ' + e;
			
			this.restack.notify('Cache failure: ' + e, true, function(){
				if (breakRequest)
					next(errorMsg);
				else
					next();
			});
		}
}


module.exports = cache;