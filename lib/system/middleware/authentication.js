module.exports = {
	jwt:require('jwt-simple'),
	moment:require('moment'),
	bcrypt:require('bcrypt'),
	check:function (req, res, next) {
		var _this = this;
		
		_this.restack.log('Authentication check middleware called');
		
		if (req.operation.type == 'Login' && req.method == 'POST'){
			_this.restack.authenticationHelper.login({username:req.operation.data.username, secret:req.operation.data.secret}, function(e, token){
				
				if (!e)
				{
					//we don't want to store this
					delete req.operation.data.secret;
					req.operation.data.token = token;
					
					_this.restack.log('Logged in successfully: ' + token);
					
					next();
				}
				else
					next(e);
				
			});
		}
		else if (req.operation.type == 'User' && req.method == 'GET' && req.operation.criteria['confirmKey'] != null){
			//we are attempting to confirm the account
			next();
		}
		else if (req.operation.type == 'User' && req.method == 'POST'){
			//so no authtoken or anything - new user
			next();
		}
		else
		{
			try
			{
					_this.restack.authenticationHelper.decodeToken({token:req.headers['token']}, function(e, credentials){
					
					if (!e)
					{
						this.restack.log('setting credentials: ');
						this.restack.log(credentials);
						req.operation.credentials = credentials;
						
						if (req.operation.type == 'Account' && req.method == 'POST')
						{
							//we have no user-account header
							next();
						}
						else
						{
							var account = req.headers['user-account'];
							
							var attachRole = function(userAccount){
								if (userAccount != null)
								{
									req.operation.credentials.accountId = userAccount.accountId;
									
									_this.restack.dataCacheHelper.find('Role', {id:userAccount.roleId}, function(e, role){
										if (!e && role != null)
										{
											req.operation.credentials.role = role;
											next();
										}
										else
											next(_this.restack.messagesHelper.authenticationNoRole());//'Authentication failed: could not find role for user');
									});
									
								}
								else
									next(_this.restack.messagesHelper.badUserAccountHeader());//'Authentication failed: Invalid user-account header');
							};
							
							_this.restack.dataCacheHelper.find('UserAccount', {id:account.id}, function(e, userAccount){
								
								if (!e)
									attachRole(userAccount);
								else
									next(_this.restack.messagesHelper.badUserAccountHeader());//'Authentication failed: Invalid user-account header');
								
							});
						}
					}
					else
						next(e);
					
				});	
			}
			catch(e)
			{
				next(e);
			}
		}
	}
}