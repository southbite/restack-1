var authorization =  {
		bcrypt:require('bcrypt'),
		uuid:require('node-uuid'),
		check:function(req,res,next){
		
			var _this = this;
			
			if (req.operation.type == 'Account' && req.method == 'POST')
			{
				//just generate a random confirm key, and add to the acc object
				
				var salt = _this.bcrypt.genSaltSync(10);
				req.operation.data.confirmKey = _this.bcrypt.hashSync(_this.uuid.v4(), salt);
				req.operation.data.status = 'Unconfirmed';//just in case someone is playing funny business
				
				next();
			}
			else if (req.operation.type == 'Account' && req.method == 'GET' && req.operation.criteria['confirmKey'] != null){
				try
				{
					//we are now confirming an account
					_this.restack.dataPlugin.find('Account', {confirmKey:req.operation.criteria['confirmKey']}, function(e, account) { 
						
						if (!e && account != null)
						{
							if (account.status == 'Confirmed')
								next(_this.restack.messagesPlugin.accountAlreadyConfirmed(account));
							else if (account.owner != req.operation.credentials.id)
								next(_this.restack.messagesPlugin.accountConfirmWithoutOwnership(account));
							else
							{
								this.restack.dataPlugin.update('Account', req.operation.criteria, {status:'Confirmed'}, {}, function(err, results) { 
									if (!err)
										next();
									else
										next(_this.restack.messagesPlugin.accountConfirmUpdateFailed(account));
									
								}.bind(this));
							}
								
							next();
						}
						else
							next(_this.restack.messagesPlugin.accountConfirmFailed());
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
					next(_this.restack.messagesPlugin.unauthorizedAccess(req));
			
			}
		},
		update:function(req, res, next)
		{
			var _this = this;
			
			if (req.operation.type == 'Account' && req.method == 'POST')
			{
				//send a confirmation email to the account owner with the confirm key
				_this.restack.notificationPlugin.email({recipients:[req.operation.credentials.emailAddress], 
					subjectLine: _this.restack.messagesPlugin.accountRegisterSubject({accountName:req.payload.name}), 
					content:_this.restack.messagesPlugin.accountRegister({names:credentials.names, accountName:req.payload.name, confirmKey:req.payload.confirmKey})});
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