//'createUser', 'confirmUser', 'linkUserToAccount', 'createRole', 'assignRole', 'createAccount', 'confirmAccount', 'login', 'availableAccounts', 'getRolePermissions', 'setRolePermissions'

var authorizationHelper = {
		internals:{},
		initialize:function(params, done){
			//done('Not implemented');
			console.log('authorizationHelper initialized');
			done();
		},
		linkAccountOwner:function(params, done){
			var _this = this;
			
			_this.restack.dataCacheHelper.create('Role',{accountId:params.account.id, name:'owner', permissions:[{method:'*', types:['*']}]}, function(e, roleCreated){
				if (!e)
				{
					var role = roleCreated[0];
					
					_this.restack.log('owner role created');
					_this.restack.log(role);
					_this.restack.dataCacheHelper.create('UserAccount',{accountId:params.account.id, roleId:role.id, userId:params.credentials.user.id}, function(e, userAccountCreated){
						
						if (!e)
						{
							var userAccount = userAccountCreated[0];
							
							_this.restack.log('user account role created');
							_this.restack.log(userAccount);
							done(null, userAccount);
						}
						else
							done(e);
						
					});
				}
				else
				{
					done(e);
				}
			});
		}
};

module.exports = authorizationHelper;