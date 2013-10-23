//'createUser', 'confirmUser', 'linkUserToAccount', 'createRole', 'assignRole', 'createAccount', 'confirmAccount', 'login', 'availableAccounts', 'getRolePermissions', 'setRolePermissions'

var authorizationHelper = {
		internals:{},
		initialize:function(params, done){
			//done('Not implemented');
			console.log('authorizationHelper initialized');
			done();
		}
};

module.exports = authorizationHelper;