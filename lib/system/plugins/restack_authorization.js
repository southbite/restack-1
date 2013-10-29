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
			
			_this.restack.dataCacheHelper.create('Role',{accountId:params.account.id, name:'owner', permissions:[{method:'*', types:['*']}]}, function(e, role){
				if (!e)
				{
					_this.restack.dataCacheHelper.create('UserAccount',{accountId:params.account.id, roleId:role.id, userId:req.operation.credentials.id}, function(e, userAccount){
						
						if (!e)
							done(null, userAccount);
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