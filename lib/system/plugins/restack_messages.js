var messagesHelper = {
	internals:{
		handlebars:null
	},
	initialize:function(params, done){
		try
		{
			this.internals.handlebars = require('handlebars');
			this.restack.log('Messages plugin initialized');
		    done(null);
		}
		catch(e)
		{
			done(e);
		}
	},
	performReplace:function(text, params)
	{
		try
		{
			this.internals.handlebars.compile(text, params);
		}
		catch(e)
		{
			throw 'Failure in compiling message: ' + e;
		}
	},
	userRegister:function(params){
		var regContent = 'Hi {{names}},\r\n';
		
		regContent += 'Your account confirmation key is {{confirmKey}}\r\n';
		regContent += 'You can paste it into your confirmation screen or click <a href=\"' + this.restack.settings.baseURL + '/User?key={{confirmKey}}\">here<a/> to confirm.';
		
		return performReplace(regContent, params);
	},
	userRegisterSubject:function(params){
		return performReplace("Confirm your " + this.restack.settings.applicationName + " account", params);
	},
	unauthorizedAccess:function(req)
	{
		return performReplace('User is not permitted to perform {{method}} on the type {{operation.type}}', req);
	},
	userConfirmUpdateFailed:function(user, e)
	{
		return performReplace('A failure happened trying to update the {{name}} account to confirmed: ' + e, user);
	},
	userAlreadyConfirmed:function(user)
	{
		return performReplace('Your user has already been confirmed');
	},
	userConfirmFailed:function()
	{
		return 'A failure happened trying to confirm the user account';
	},
	authenticationBadCredentials:function()
	{
		return "Authentication Error: Bad username or password";
	},
	authenticationNoToken:function()
	{
		return "Authentication failed: No authentication token was found in the request headers";
	},
	authenticationExpiredToken:function()
	{
		return "Authentication failed: Authentication token has expired";
	},
	authenticationNoRole:function()
	{
		return "Authentication failed: Could not find role for user";
	},
	authenticationNoOwnerRole:function()
	{
		return "Owner role has not been initialized";
	},
	badUserAccountHeader:function()
	{
		return "Authentication failed: Invalid user-account header";
	}
}

module.exports = messagesHelper;