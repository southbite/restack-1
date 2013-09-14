var cache =  {
		check:function(req,res,next){
			req.operation.cache = {hit:false};
			if (['getAll', 'getById'].indexOf(req.operation.name) == -1)
			{
				//populate data, record hit
				next();
			}
			else
				next();
		},
		update:function(req,res,next)
		{
			if (['getAll', 'getById'].indexOf(req.operation.name) == -1)
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