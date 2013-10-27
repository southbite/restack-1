module.exports = {
	jwt:require('jwt-simple'),
	moment:require('moment'),
	bcrypt:require('bcrypt'),
	roleModel:this.restack.schema.getModel("Role"),
	userAccountModel:this.restack.schema.getModel("UserAccount"),
	check:function (req, res, next) {
		
		var _this = this;
		
		if (req.operation.type == 'Login' && req.method == 'POST'){
		//login attempt is happening
		this.restack.dataPlugin.find('User', {username:req.operation.data.username}, function(err, user) { 
			try
			{
				if (err)
					throw err;
				
				if (user == null)
					throw "Authentication Error: Bad username or password";
				
				_this.bcrypt.compare(req.operation.data.secret, user.secret, function(err, res) {
					if (!err && res)
					{
						//we generate a session token containing the username, and the expiry time
						var token = _this.jwt.encode({username: user.username, name:user.name, ttl:_this.restack.settings.tokenttl, expires: _this.moment.unix() + (_this.restack.settings.tokenttl * 60), emailAddress: user.emailAddress}, _this.restack.settings.authTokenSecret);
						req.operation.data.token = token;
						
						//we don't want to store this
						delete req.operation.data.secret;
						
						next();
					}
					else
				    	next("Authentication Error: Bad username or password");
				    
				});
			}
			catch(e)
			{
				next(e);
			}
			
		});
	}
	else if (req.operation.type == 'User' && req.method == 'POST'){
		try
		{
			var salt = _this.bcrypt.genSaltSync(10);
			req.operation.data.secret = _this.bcrypt.hashSync(req.operation.data.secret, salt);
			next();
		}
		catch(e)
		{
			next(e);
		}
	}
	else{
		try
		{
			var token = req.headers['token'];
			var account = req.headers['user-account'];
			
			if (!token)
				throw 'Authentication failed: No authentication token was found';
			
			var decoded = _this.jwt.decode(token, secret);
			
			//we allow for a minute, in case the backend code takes a while to sync
			if (decoded.expires + 60 < _this.moment.unix())
				throw "Authentication failed: Authentication token has expired";
			
			req.operation.credentials = decoded;
			
			var attachRole = function(userAccount){
				if (userAccount != null)
				{
					_this.restack.cachePlugin.find({collection:'Role', key:userAccount.roleId, ttl:_this.roleModel.ttl}, function(e, role){
						
						if (role == null || e)
						{
							_this.restack.dataPlugin.find('Role', {id:userAccount.roleId}, function(e, role) { 
								
								if (!e && role != null)
								{
									req.operation.credentials.role = role;
									next();
								}
								else
									next('Authentication failed: could not find role for user');
							});
						}
						else
						{
							req.operation.credentials.role = role;
							next();
						}
						
					});
				}
				else
					next('Authentication failed: Invalid user-account header');
			};
			
			//now we grab the username and using the accountId in the account header - we get the role and attach it to the user
			_this.restack.cachePlugin.find({collection:'UserAccount', key:account, ttl:_this.userAccountModel.ttl}, function(e, userAccount){
				if (userAccount == null || e)
				{
					this.restack.dataPlugin.find('UserAccount', {id:account}, function(e, userAccount) { 
						
						if (!e)
							attachRole(userAccount);
						else
							next('Authentication failed: Invalid user-account header');
						});
					}
					else
						attachRole(userAccount);
				});
				
			}
			catch(e)
			{
				next(e);
			}
		}
	}
}