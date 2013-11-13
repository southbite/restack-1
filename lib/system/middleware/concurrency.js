var concurrency =  {
		check:function(req,res,next){
			
			if (req.method == 'PUT')
			{
				this.restack.log('Concurrency middleware check called');
				var model = this.restack.schema.model[type];
				if (model.directives.concurrency == true)
				{
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
							concurrencyPassed = 'Items with concurrency directives must include an id and a systemVersion value on updates';
							break;
						}
					}
					
					if (concurrencyPassed == 'OK')
						this.restack.concurrencyHelper.check(req.operation.type, dataArray, function(e){
							next(e);
						});
					else
						next(concurrencyPassed);
					
				}
				else
					next();
			}
			else
				next();
		}
}


module.exports = concurrency;