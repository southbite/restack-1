var concurrency =  {
		check:function(req,res,next){
			
			if (['PUT'].indexOf(req.method) == 0)
			{
				this.restack.log('Concurrency middleware check called');
				next();
			}
			else
				next();
		},
		update:function(req,res,next)
		{
			if (['GET', 'PUT'].indexOf(req.method) == 0)
			{
				this.restack.log('Concurrency middleware update called');
				next();
			}
			else
				next();
		}
}


module.exports = concurrency;