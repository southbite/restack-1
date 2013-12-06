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
			return this.internals.handlebars.compile(text)(params);
		}
		catch(e)
		{
			throw 'Failure in compiling message: ' + e;
		}
	},
	userRegister:function(params){
		this.restack.log('Updating user register body');
		this.restack.log(params);
		
		var regContent = 'Hi {{names}},\r\n';
		
		regContent += 'Your account confirmation key is {{confirmKey}}\r\n';
		regContent += 'You can paste it into your confirmation screen or click <a href=\"' + this.restack.settings.baseURL + '/User?key={{confirmKey}}\">here<a/> to confirm.';
		
		var body = this.performReplace(regContent, params);
		
		this.restack.log('User register body');
		this.restack.log(body);
		
		return body;
	},
	userRegisterSubject:function(params){
		this.restack.log('Updating user register subject');
		return this.performReplace("Confirm your " + this.restack.settings.applicationName + " account", params);
	},
	unauthorizedAccess:function(req)
	{
		return this.performReplace('User is not permitted to perform {{method}} on the type {{operation.type}}', req);
	},
	userConfirmUpdateFailed:function(user, e)
	{
		return this.performReplace('A failure happened trying to update the {{name}} account to confirmed: ' + e, user);
	},
	userAlreadyConfirmed:function(user)
	{
		return this.performReplace('Your user has already been confirmed');
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
	},
	concurrencyNotFound:function(type, id)
	{
		return this.performReplace("Concurrency check failed: Couldn't find item of type: {{type}} with id: {{id}}", {type:type,id:id});
	},
	concurrencyBadParameters:function()
	{
		return "Concurrency check failed: 'Items with concurrency directives must include an id and a systemVersion value on updates";
	},
	concurrencyConflict:function(type, id, systemVersion)
	{
		return this.performReplace("Concurrency check failed: The {{type}} with id: {{id}} has an old systemVersion: {{systemVersion}}", {type:type,id:id,systemVersion:systemVersion});
	},
	validationRequiredFailed:function(type, propertyName){
		return this.performReplace("Validation check failed: The {{type}} is missing a value for {{propertyName}}", {type:type,propertyName:propertyName});
	},
	validationTypeFailed:function(type, propertyName, propertyType){
		return this.performReplace("Validation check failed: The {{type}} expects a {{propertyType}} for the property {{propertyName}}", {type:type,propertyName:propertyName,propertyType:propertyType});
	},
	validationUniqueFailed:function(type, propertyName){
		return this.performReplace("Validation check failed: The {{type}} {{propertyName}} is not unique", {type:type,propertyName:propertyName});
	},
	historyCheckFailed:function(directive){
		return this.performReplace("History operation {{directive}} attempted without an id in the criteria", {directive:directive});
	},
	historyUpdateFailed:function(directive, e){
		return this.performReplace("History operation {{directive}} failed: {{error}}", {directive:directive, error:e});
	}
}

module.exports = messagesHelper;