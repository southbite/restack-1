var messagesHelper = {
	internals:{
		handlebars:null
	},
	initialize:function(params, done){
		try
		{
			this.internals.handlebars = require('handlebars');
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
	accountRegister:function(params){
		var regContent = 'Hi {{names}},\r\n';
		
		regContent += 'Your account confirmation key is {{confirmKey}}\r\n';
		regContent += 'You can paste it into your confirmation screen or click <a href=\"' + this.restack.settings.baseURL + '/ConfirmAccount?key={{confirmKey}}\">here<a/> to confirm.';
		
		return performReplace(regContent, params);
	},
	accountRegisterSubject:function(params){
		return performReplace("Confirm your " + this.restack.settings.applicationName + ", {{accountName}} account", params);
	},
	unauthorizedAccess:function(req)
	{
		return performReplace('User is not permitted to perform {{method}} on the type {{operation.type}}', req);
	},
	accountConfirmWithoutOwnership:function(account)
	{
		return performReplace('Only the owner is allowed to confirm the {{name}} account', account);
	},
	accountConfirmUpdateFailed:function(account, e)
	{
		return performReplace('A failure happened trying to update the {{name}} account to confirmed: ' + e, account);
	},
	accountAlreadyConfirmed:function(account)
	{
		return performReplace('The {{name}} account has already been confirmed');
	},
	accountConfirmFailed:function()
	{
		return 'A failure happened trying to confirm the account';
	}
}

module.exports = notifyHelper;