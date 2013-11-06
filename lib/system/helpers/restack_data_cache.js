var data_cache_helper = {
	internals:{
		
	},
	initialize:function(params, done)
	{
		this.restack.log("Data-cache helper initialized");
		done();
	},
	find:function(type, criteria, done){
	   var _this = this;
	   var model = _this.restack.schema.getModel(type);
	   
	   var findInData = function(type, criteria, done)
	   {
		   _this.restack.dataHelper.find(type, criteria, function(e, items) { 
				
				if (!e && items != null)
				{
					done(null, items);
				}
				else
					done(e, null);
			});
	   }
	   
	   if (this.restack.settings.operational.cache_up && model.ttl >= 0 && criteria.id != null)
		   _this.restack.cacheHelper.find({collection:type, key:criteria.id, ttl:model.ttl}, function(e, items){
				
			   if (items != null)
				   done(null, items);
			   else
				   findInData(type, criteria, done);
			});
	   else
		   findInData(type, criteria, done);
	   
	},
	create:function(type, data, done) {
		var _this = this;
		var model = _this.restack.schema.getModel(type);
		
		_this.restack.dataHelper.create(type, data, function(e, created){
			if (!e)
			{
				if (this.restack.settings.operational.cache_up && model.ttl >= 0)
				{
					_this.restack.cacheHelper.update({collection:type, key:created.id, data:created}, function(e, response){
						
						if (!e)
							done(null, created);
						else
							done('Item created, cache not updated: ' + e);
						
					});
				}
				else
					done(null, created);
			}
			else
				done(e);
		});
	}
}

module.exports = data_cache_helper;