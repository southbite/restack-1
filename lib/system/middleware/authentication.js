module.exports = {
	jwt:require('jwt-simple'),
	moment:require('moment'),
	bcrypt:require('bcrypt'),
	check:function (req, res, next) {
		var _this = this;
			
		if (req.operation.type == 'Login' && req.method == 'POST'){
			_this.restack.authenticationHelper.login({username:req.operation.data.username, secret:req.operation.data.secret}, function(e, token){
				
				if (!e)
				{
					//we don't want to store this
					delete req.operation.data.secret;
					req.operation.data.token = token;
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
		else if (req.operation.type == 'Account' && req.method == 'POST'){
			try
			{
				req.operation.credentials = _this.restack.authenticationHelper.decodeToken({token:req.headers['token']}, function(){
					
					if (!e)
						//creds are OK, we move on
						next();
					else
						next(e);
					
				});
				
			}
			catch(e)
			{
				next(e);
			}
		}
		else
		{
			try
			{
				req.operation.credentials = _this.decodeToken(req);
				var account = req.headers['user-account'];
				
				var attachRole = function(userAccount){
					if (userAccount != null)
					{
						
						
						var roleModel = _this.restack.schema.getModel("Role");
						
						_this.restack.cacheHelper.find({collection:'Role', key:userAccount.roleId, ttl:roleModel.ttl}, function(e, role){
							
							if (role == null || e)
							{
								_this.restack.dataHelper.find('Role', {id:userAccount.roleId}, function(e, role) { 
									
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
							{
								req.operation.credentials.role = role;
								next();
							}
							
						});
					}
					else
						next(_this.restack.messagesHelper.badUserAccountHeader());//'Authentication failed: Invalid user-account header');
				};
				
				var userAccountModel = this.restack.schema.getModel("UserAccount");
				
				//now we grab the username and using the accountId in the account header - we get the role and attach it to the user
				_this.restack.cacheHelper.find({collection:'UserAccount', key:account, ttl:userAccountModel.ttl}, function(e, userAccount){
					if (userAccount == null || e)
					{
						this.restack.dataHelper.find('UserAccount', {id:account}, function(e, userAccount) { 
							
							if (!e)
								attachRole(userAccount);
							else
								next(_this.restack.messagesHelper.badUserAccountHeader());//'Authentication failed: Invalid user-account header');
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