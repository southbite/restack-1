//REMEMBER start yr redis server with the following policy, obviously you can use more than 20mb of memory...
//redis-server --maxmemory 20mb --maxmemory-policy volatile-lru

var notifyHelper = {
	internals:{
		emailProvider:null,
		smsProvider:null,
		emailFromAddress:null,
	},
	initialize:function(params, done){
		try
		{
			var Mailgun = require('mailgun').Mailgun;
			this.internals.emailProvider = new Mailgun(params.mailGunKey);
			
			if (params.defaultFromAddress)
				this.internals.emailFromAddress = params.emailFromAddress;
			
		    done(null);
		}
		catch(e)
		{
			done(e);
		}
	},
	email:function(params, done){
		var _this = this;
		try
		{
			var fromAddress = null;
			if (params.fromAddress == null)
				fromAddress = this.emailFromAddress;
			
			if (fromAddress == null)
				throw "The fromAddress parameter was not specified";
			
			_this.internals.emailProvider.sendText(fromAddress, params.recipients, params.subjectLine, params.content,  function(err){
				
				if (!err)
				{
					done();
				}
				else
				{
					done(err);
				}
				
			});
		}
		catch(e)
		{
			done(e);
		}
	},
	sms:function(params, done){
		var _this = this;
		try
		{
			
			done();
		}
		catch(e)
		{
			
			done(e);
		}
	}
}

module.exports = notifyHelper;