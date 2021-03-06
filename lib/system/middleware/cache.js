var cache =  {
		check:function(req,res,next){
		
			this.restack.log('Cache check middleware called');
			
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
					this.restack.log('GET called checking cache');
					this.restack.log(model);
					if (model.directives.cacheTTLMinutes >= 0)
					{
						//TODO modify log call to work like this:
						this.restack.log({msg:'checking cache....',level:0, notify:false, module:'cache middleware'});
						
						if (req.operation.criteria.id != null && Object.keys(req.operation.criteria).length == 1)
						{
							//we getting by id
							this.restack.log({msg:'getting by id...',level:0, notify:false, module:'cache middleware'});
							this.restack.cacheHelper.find({collection:req.operation.type, key:req.operation.criteria.id, ttl:(model.directives.cacheTTLMinutes * 60000)}, function(e, found){
								
								if (!e)
								{
									this.restack.log({msg:'cache hit....' + JSON.stringify(found),level:0, notify:false});
									
									if (found != null)
									{
										req.operation.cache.hit = true;
										req.operation.payload = [found];
										
										this.restack.inputOutputHelper.writeResponse(null, res, req);
									}
								}
								else
									this.failed(e, false, next);//we move on - log a cache error, but have no cache hit - so the cache degrades gracefully
							});
						}
						else if ((Object.keys(req.operation.criteria).length == 0) || (req.operation.criteria["deleted"] != null && Object.keys(req.operation.criteria).length == 1) && this.restack.cacheHelper.statics[req.operation.type] == true)
						{
							this.restack.log({msg:'getting all by type...',level:0, notify:false});
							//we getting all because everything is statically loaded
							this.restack.cacheHelper.findAll({collection:req.operation.type, key:null, ttl:model.directives.cacheTTLMinutes * 60000}, function(e, found){
								
								if (!e)
								{
									if (found.length > 0)
									{
										req.operation.cache.hit = true;
										req.operation.payload = found;
									}
										
									this.restack.inputOutputHelper.writeResponse(null, res, req);
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
			this.restack.log('Cache update middleware called');
			
			this.restack.log(req.operation.payload);
			var model = this.restack.schema.getModel(req.operation.type);
			
			if (!this.restack.settings.operational.cache_up || model.directives == null)
			{
				this.restack.log('cache update skipped....');
				next();
			}
			else
			{
				if (req.method != 'DELETE' && model.directives.cacheTTLMinutes >= 0 && req.operation.payload.length > 0)
				{
					//we are caching for this item, and we have a payload
					this.restack.log('updating cache for possible statics....');
					this.restack.log(JSON.stringify(req.operation.criteria));
					
					if (req.method == 'GET' && (Object.keys(req.operation.criteria).length == 0 || (req.operation.criteria["deleted"] == false && Object.keys(req.operation.criteria).length == 1)))
					{
						this.restack.log('updating cache for getall for type:' + req.operation.type);
						//so no hit - but we have a payload for a successful getall, which we will push to cache
						this.restack.cacheHelper.updateAll({collection:req.operation.type, keyName:'id', data:req.operation.payload, ttl:model.directives.cacheTTLMinutes * 60000}, function(e){
							
							if (!e)
							{
								//means we got everything, and it is statically cached
								this.restack.cacheHelper.statics[req.operation.type] = true;
								next();
							}
							else
								this.failed(e, false, next);
							
						});
					}
					else if (req.method == 'GET' && req.operation.criteria.id != null)
					{
						//getting by id
						//so no hit - but we have a payload, which we will push to cache
						this.restack.log('pushing get with id for type: ' + req.operation.type);
						this.restack.cacheHelper.update({collection:req.operation.type, keyName:'id', data:req.operation.payload, ttl:model.directives.cacheTTLMinutes * 60000}, function(e){
							if (!e)
								next();
							else
								this.failed(e, false, next);
						});
					}
					else if (req.method == 'POST' && req.operation.payload.length > 0)
					{
						this.restack.log('pushing post for type: ' + req.operation.type);
						this.restack.log(req.operation.payload);
						//inserts pass back the new items as part of the payload, so we can update the cache
						this.restack.cacheHelper.updateAll({collection:req.operation.type, keyName:'id', data:req.operation.payload, ttl:model.directives.cacheTTLMinutes * 60000}, function(e){
							if (!e)
								next();
							else
								this.failed(e, false, next);
						});
					}
					else if (req.method == 'PUT' && req.operation.payload.length > 0){
						this.restack.log('emptying cache for type: ' + req.operation.type);
						//for all multiple PUTs - because we dont have id's or objects to update the cache with
						this.restack.cacheHelper.statics[req.operation.type] = false; //do this regardless because it is true that the data has changed
						this.restack.cacheHelper.clearCollection({collection:req.operation.type}, function(e){
							if (!e)
								next();
							else
								this.failed(e, false, next);
						});
					}
					else
					{
						this.restack.log('cache not updateable');
						next();
					}
						
				}
				else if (req.method == 'DELETE' && req.operation.criteria.id != null && req.operation.payload == 1)
					//single delete so we can remove the item from the cache as we have its id
					this.restack.cacheHelper.clear({collection:req.operation.type, key:req.operation.criteria.id}, function(e){
						if (!e)
							next();
						else
							this.failed(e, false, next);
					});
				else if (req.method == 'DELETE' && req.operation.criteria.id == null && req.operation.payload > 0)
					{
						//multiple delete, multiple items deleted - we cannot identify them - so clear the cache by type
						console.log('doing multiple delete');
						this.restack.cacheHelper.statics[req.operation.type] = false; //do this regardless because it is true that the data has changed
						this.restack.cacheHelper.clearAll({collection:req.operation.type}, function(e){
							if (!e)
								next();
							else
								this.failed(e, false, next);
						});
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