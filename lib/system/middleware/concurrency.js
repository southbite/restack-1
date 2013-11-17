var concurrency =  {
		check:function(req,res,next){
			
			if (req.method == 'PUT')
			{
				this.restack.log('Concurrency middleware check called');
				//this.restack.log(this.restack.schema);
				//this.restack.log(this.restack.schema.model[req.operation.type]);
				var model = this.restack.schema.model[req.operation.type];
				if (model.directives.checkVersionConcurrency == true)
				{
					this.restack.log('Concurrency check happening');
					this.restack.log(req.operation.data);
					this.restack.concurrencyHelper.check(req.operation, function(e){
						next(e);
					});
				}
				else
					next();
			}
			else
				next();
		},
		update:function(req,res,next){
			
			if (req.method == 'PUT')
			{
				this.restack.log('Concurrency middleware update called');
				var model = this.restack.schema.model[req.operation.type];
				if (model.directives.checkVersionConcurrency == true)
				{
					this.restack.log('Concurrency update happening');
					this.restack.concurrencyHelper.update(req.operation, function(e){
						next(e);
					});
				}
				else
					next();
			}
			else
				next();
		}
}


module.exports = concurrency;