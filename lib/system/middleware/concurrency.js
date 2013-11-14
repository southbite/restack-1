var concurrency =  {
		check:function(req,res,next){
			
			if (req.method == 'PUT')
			{
				this.restack.log('Concurrency middleware check called');
				var model = this.restack.schema.model[req.operation.type];
				if (model.directives.concurrency == true)
				{
					this.restack.concurrencyHelper.check(req.operation.type, data, function(e){
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