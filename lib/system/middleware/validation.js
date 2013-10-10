var validation = function (req,res,next) {
	try
	{
		this.handle.restack.log("Validation middleware");
		//this.restack.log(this);
		this.handle.restack.log("Validation plugin running for type " + req.operation.type);
		
		if ([ 'POST' ].indexOf(req.method) != -1 && req.operation.data != null)
		{
			this.handle.restack.validationPlugin.validateRequest(req.operation.type, req.operation.data, function(e){
				
				if (!e)
				{
					this.handle.restack.log("Validation successful");	
					next();
				}
				else
				{
					this.handle.restack.log("Error happened during validation");
					this.handle.restack.log(e);
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
		this.handle.restack.log("Error happened during validation");
		this.handle.restack.log(e);
		next(e);
	}
	
	
}

module.exports = validation;