var authorization =  {
		bcrypt:require('bcrypt'),
		uuid:require('node-uuid'),
		check:function(req,res,next){
		
			var _this = this;
			
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
								
							next();
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
				if (type == 'UserAccount' && operation.credentials.role.id == req.operation.data.roleId && req.method == "PUT")
				{
					//naughty - you cannot change yr own role
					next(_this.restack.messagesHelper.cannotChangeOwnRole());
				}
				else if (operation.credentials.role.name == 'owner')//quicker for d owner
					next();//the owner can do anything to anything
				else
				{
					for (var permissionIndex in operation.credentials.role.permissions)
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
						next(_this.restack.messagesHelper.unauthorizedAccess(req));
				}
			}
		},
		update:function(req, res, next)
		{
			var _this = this;
			
			if (req.operation.type == 'User' && req.method == 'POST')
			{
				//send a confirmation email to the account owner with the confirm key
				_this.restack.notificationHelper.email({recipients:[req.operation.payload.emailAddress], 
					subjectLine: _this.restack.messagesHelper.userRegisterSubject({accountName:req.operation.payload.names}), 
					content:_this.restack.messagesHelper.userRegister({names:req.operation.payload.names, confirmKey:req.operation.payload.confirmKey})});
				
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