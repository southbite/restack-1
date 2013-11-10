module.exports = {
	check:function (req, res, next) {
		var _this = this;
		_this.restack.log('Pubsub check middleware called');
		
		try
		{
			
			next();
		}
		catch(e)
		{
			next(e);
		}
	}
}