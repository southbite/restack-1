var authorization =  {
		bcrypt:require('bcrypt'),
		uuid:require('node-uuid'),
		check:function(req,res,next){
		
			var _this = this;
			this.restack.log('Authorization check happening...');
			
			if (req.operation.type == 'User' && req.method == 'POST')
			{
				//just generate a random confirm key, and add to the acc object
				
				var salt = _this.bcrypt.genSaltSync(10);
				req.operation.data.confirmKey = _this.bcrypt.hashSync(_this.uuid.v4(), salt);
				req.operation.data.secret = _this.bcrypt.hashSync(req.operation.data.secret, salt);
				req.operation.data.status = 'Unconfirmed';//just in case someone is playing funny business
				
				next();
			}
			else if (req.operation.type == 'Account' && req.method == 'POST')
			{
				//we are authenticated, so we can create an empty account
				next();
			}
			else if (req.operation.type == 'Login' && req.method == 'POST')
			{
				//we are authenticated, so we can create an empty account
				next();
			}
			else if (req.operation.type == 'User' && req.method == 'GET' && req.operation.criteria['confirmKey'] != null){
				try
				{
					//we are now confirming a user account
					_this.restack.dataHelper.find('User', {confirmKey:req.operation.criteria['confirmKey']}, function(e, user) { 
						
						if (!e && user != null)
						{
							if (user.status == 'Confirmed')
								next(_this.restack.messagesHelper.userAlreadyConfirmed(user));
							else
							{
								this.restack.dataHelper.update('User', req.operation.criteria, {status:'Confirmed'}, {}, function(err, results) { 
									if (!err)
										next();
									else
										next(_this.restack.messagesHelper.userConfirmUpdateFailed(user));
									
								}.bind(this));
							}
						}
						else
							next(_this.restack.messagesHelper.userConfirmFailed());
					});
						
				}
				catch(e)
				{
					next(e);
				}
			}
			else
			{
				var authorized = false;
				if (req.operation.type == 'UserAccount' && operation.credentials.role.id == req.operation.data.roleId && req.method == "PUT")
				{
					//naughty - you cannot change yr own role
					next(_this.restack.messagesHelper.cannotChangeOwnRole());
				}
				else if (req.operation.credentials.role.name == 'owner')//quicker for d owner
					next();//the owner can do anything to anything
				else
				{
					
					_this.restack.log(req.operation.credentials);
					
					for (var permissionIndex in req.operation.credentials.role.permissions)
					{
						var permissionInstance = role.permissions[permissionIndex];
						if (permissionInstance[req.method].indexOf(req.operation.type) > -1)
						{
							authorized = true;
							break;
						}
					}
					
					_this.restack.log('Authorize happened, access: ' + authorized);
					
					if (authorized)
						next();
					else
						next(_this.restack.messagesHelper.unauthorizedAccess(req));
				}
			}
		},
		update:function(req, res, next)
		{
			var _this = this;
			
			_this.restack.log('Authorization update middleware called');
			
			if (req.operation.type == 'User' && req.method == 'POST')
			{
				this.restack.log('Sending confirm email...');
				this.restack.log(req.operation.payload);
				this.restack.log(req.operation.payload[0].emailaddress);
				
				//send a confirmation email to the account owner with the confirm key
				_this.restack.notificationHelper.email({recipients:[req.operation.payload[0].emailaddress], 
					subjectLine: _this.restack.messagesHelper.userRegisterSubject(req.operation.payload[0]), 
					content:_this.restack.messagesHelper.userRegister(req.operation.payload[0])}, function(e){
						if (e)
						{
							next(e);
						}
						else
						{
							if (_this.restack.settings.allowConfirmKeyPassback == true && req.headers['return-confirm-key'] == 'true')
							{
								next();
							}
							else
							{
								delete req.operation.payload.confirmKey;//we dont want to pass this back in production
								next();
							}
						}
						
					});
			}
			else if (req.operation.type == 'Account' && req.method == 'POST')
			{
				//we have created an Account, we need to save the UserAccount, linking the user to the account
				_this.restack.authorizationHelper.linkAccountOwner({credentials:req.operation.credentials, account:req.operation.payload}, function(e, userAccount){
					if (!e)
					{
						next();
					}
					else
						next(e);
				});
				
			}
			else
				next();
		}
}


module.exports = authorization;