var auth = function (req, res, next) {

	this.handle.restack.log('method ' + req.method + ' called in auth, operation area: ' + req.operation.area);
	
	if (this.handle[req.operation.name] != null)
		this.handle[req.operation.name](req, res, next);
	else
		this.handle.authenticate(req,res,next);
	
}

auth.authenticate = function(req,res,next)
{
	try
	{
		//authenticate here, throw error if unauthorized
		
		this.restack.log('operation authenticated');
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.availableAccounts = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.createUser = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.confirmUser = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.createRole = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.assignRole = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.getRolePermissions = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.setRolePermissions = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.createAccount = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.confirmAccount = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.login = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};

auth.availableAccounts = function(req,res,next)
{
	try
	{
		
		next();
	}
	catch(e)
	{
		next(e);
	}
};


module.exports = auth;