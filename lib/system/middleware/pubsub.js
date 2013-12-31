module.exports = {
	check:function (req, res, next) {
		var _this = this;
		_this.restack.log('Pubsub check middleware called');
		
		try
		{
			if (['POST', 'PUT', 'DELETE'].indexOf(req.method) != -1)
			{
				_this.restack.pubSubHelper.emit({channel:req.method + '_' + req.operation.type, data:req.operation}, function(e){
					next(e);
				});
			}
			else
				next();
		}
		catch(e)
		{
			next(e);
		}
	}
}