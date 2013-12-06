var validation = function (req,res,next) {
	try
	{
		var _this = this;
		_this.restack.log('validation happening...');
		
		if ([ 'POST','PUT' ].indexOf(req.method) != -1 && req.operation.data != null)
		{
			_this.restack.log("Validation middleware");
			//_this.restack.log(_this);
			_this.restack.log("Validation plugin running for type " + req.operation.type);
			
			_this.restack.validationHelper.validateRequest(req.operation.type, req.operation.data, function(e){
				
				if (!e)
				{
					_this.restack.log("Validation successful");	
					next();
				}
				else
				{
					_this.restack.log("Error happened during validation");
					_this.restack.log(e);
					req.operation.message = "Constraint validation failed";
					next(e);
				}
			}.bind(_this));
		}
		else 
			next();
	}
	catch(e)
	{
		_this.restack.log("Error happened during validation");
		_this.restack.log(e);
		next(e);
	}
	
	
}

module.exports = validation;