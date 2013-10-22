var auth = function (req, res, next) {

	this.restack.log({msg:'method ' + req.method + ' called in auth, operation area: ' + req.operation.area, module: 'auth-middleware'});
	
	if (this[req.operation.name] != null)
		this[req.operation.name](req, res, next);
	else
		this.authenticate(req,res,next);
	
}

auth.authenticate = function(req,res,next)
{
	try
	{
		//authenticate here, throw error if unauthorized
		
		this.restack.log({msg:'operation authenticated', module: 'auth-middleware'});
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