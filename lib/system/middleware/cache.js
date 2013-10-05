var cache =  {
		check:function(req,res,next){
			
			//NB: if we are putting, would be nice to grab the previous item from the cache and add it to the operation stream
			req.operation.cache = {hit:false};
			if (['GET', 'PUT'].indexOf(req.method) == 0)
			{
				//populate data, record hit
				next();
			}
			else
				next();
		},
		update:function(req,res,next)
		{
			if (['POST', 'PUT'].indexOf(req.method) == 0)
			{
				console.log('updating cache...');
				//push data into cache by id or type
				
				next();
			}
			else
				next();
		}
}


module.exports = cache;