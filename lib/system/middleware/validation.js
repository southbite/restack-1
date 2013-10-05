var validation = function (req,res,next) {

	console.log('validation called for type ' + req.operation.type);
	console.log(this.handle.restack.schema);
	
	if ([ 'POST' ].indexOf(req.method) != -1 && req.operation.data != null)
	{
		
	}
	else 
		next();
}

module.exports = validation;