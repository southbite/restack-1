var authorization =  {
		check:function(req,res,next){
		
			if (req.operation.type == 'Account' && req.method == 'POST')
			{
				//trying to create an account, create unique confirm key
				next();
			}
			else
			{
				//Permissions will live inside the role document
				this.restack.cachePlugin.find({collection:"Role", key:req.operation.session.user.roleId, ttl:0}, function(e, role){
					try
					{
						if (role == null)
							throw "Role for user does not exist";
						
						if (!e)
						{
							var authorized = false;
							for (var permissionIndex in role.permissions)
							{
								var permissionInstance = role.permissions[permissionIndex];
								if (permissionInstance[req.method].indexOf(req.operation.type) > -1)
								{
									authorized = true;
									break;
								}
							}
							
							if (authorized)
								next();
							else
								next('User is not permitted to perform ' + req.method + ' on the type ' + req.operation.type);
						}
						else
							throw e;
					}
					catch(e)
					{
						next('Failure in authentication layer: ' + e);
					}
				}.bind(this));
			}
		},
		update:function(req, res, next)
		{
			if (req.operation.type == 'Account' && req.method == 'POST')
			{
				//send a confirmation email to the account user
				next();
			}
			else if (req.operation.type == 'Role' && ['PUT','POST'].indexOf(req.method) > -1)
			{
				//update the role to the roles cache
				next();
			}
			else
				next();
		}
}


module.exports = authorization;