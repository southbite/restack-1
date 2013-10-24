module.exports = function (req, res, next) {
	if (req.operation.type == 'Login' && req.method == 'POST'){
		//login attempt is happening
		this.restack.dataPlugin.find('User', {username:req.operation.data.username}, function(err, user) { 
			try
			{
				if (err)
					throw err;
				
				if (user == null)
					throw "Authentication Error: User " + req.operation.data.username + " not found";
				
				bcrypt.compare(req.operation.data.secret, user.secret, function(err, res) {
					if (!err && res)
					{
						//we generate a session token containing the username, and the expiry time
						var jwt = require('jwt-simple');
						var moment = require('moment');

						var token = jwt.encode({username: user.username, ttl:this.restack.settings.tokenttl, expires: moment.unix() + (this.restack.settings.tokenttl * 60)}, this.restack.settings.authTokenSecret);
						req.operation.data.token = token;
						
						//we don't want to store this
						delete req.operation.data.secret;
						
						next();
					}
					else
				    	next("Authentication failed for user " + req.operation.data.username);
				    
				}.bind(this));
			}
			catch(e)
			{
				next(e);
			}
			
		}.bind(this));
	}
	else if (req.operation.type == 'User' && req.method == 'POST'){
		try
		{
			var bcrypt = require('bcrypt');
			var salt = bcrypt.genSaltSync(10);
			req.operation.data.secret = bcrypt.hashSync(req.operation.data.secret, salt);
			next();
		}
		catch(e)
		{
			next(e);
		}
	}
	else{
		try
		{
			var jwt = require('jwt-simple');
			var moment = require('moment');
			
			var token = req.headers['token'];
			var account = req.headers['account'];
			
			if (!token)
				throw 'No authentication token was found';
			
			var decoded = jwt.decode(token, secret);
			
			//we allow for a minute, in case the backend code takes a while to sync
			if (decoded.expires + 60 < moment.unix())
				throw "Authentication token has expired";
			
			//now we grab the username and using the accountId in the account header - we get the role and attach it to the user
			
			
			next();
		}
		catch(e)
		{
			next(e);
		}
	}
}