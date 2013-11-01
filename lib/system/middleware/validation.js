var validation = function (req,res,next) {
	try
	{
		this.restack.log('validation happening...');
		
		if ([ 'POST','PUT' ].indexOf(req.method) != -1 && req.operation.data != null)
		{
			this.restack.log("Validation middleware");
			//this.restack.log(this);
			this.restack.log("Validation plugin running for type " + req.operation.type);
			
			this.restack.validationHelper.validateRequest(req.operation.type, req.operation.data, function(e){
				
				if (!e)
				{
					this.restack.log("Validation successful");	
					next();
				}
				else
				{
					this.restack.log("Error happened during validation");
					this.restack.log(e);
					req.operation.message = "Constraint validation failed";
					next(e);
				}
			}.bind(this));
		}
		else 
			next();
	}
	catch(e)
	{
		this.restack.log("Error happened during validation");
		this.restack.log(e);
		next(e);
	}
	
	
}

module.exports = validation;