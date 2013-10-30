//'createUser', 'confirmUser', 'linkUserToAccount', 'createRole', 'assignRole', 'createAccount', 'confirmAccount', 'login', 'availableAccounts', 'getRolePermissions', 'setRolePermissions'

var authenticationHelper = {
		internals:{
			jwt:require('jwt-simple'),
			moment:require('moment'),
			bcrypt:require('bcrypt')
		},
		initialize:function(params, done){
			//done('Not implemented');
			this.internals.roleModel = this.restack.schema.getModel("Role");
			this.internals.userAccountModel = this.restack.schema.getModel("UserAccount");
			
			console.log('authenticationHelper initialized');
			done();
		},
		encodeToken:function(params, done){
			try
			{
				var token = _this.internals.jwt.encode({username: params.username, name:params.name, ttl:_this.restack.settings.tokenttl, expires: _this.internals.moment.unix() + (_this.restack.settings.tokenttl * 60), emailAddress: params.emailAddress, id: params.id}, _this.restack.settings.authTokenSecret);
				done(null, token);
			}
			catch(e)
			{
				done(e);
			}
		},
		decodeToken:function(params, done){
			
			try
			{
				var _this = this;
				
				var token = req.headers['token'];
			
				if (!token)
					throw _this.restack.messagesHelper.authenticationNoToken();//'Authentication failed: No authentication token was found in the request headers';
				
				var decoded = _this.jwt.decode(token, _this.restack.settings.authTokenSecret);
				
				//we allow for a minute, in case the backend code takes a while to sync
				if (decoded.expires + 60 < _this.moment.unix())
					throw _this.restack.messagesHelper.authenticationExpiredToken();//"Authentication failed: Authentication token has expired";
				
				return decoded;
			}
			catch(e)
			{
				done(e);
			}
		},
		encryptSecret:function(params, done){
			var _this = this;
			_this.internals.bcrypt.genSalt(10, function(err, salt) {
				if (!err)
					_this.internals.bcrypt.hash(params.secret, salt, function(err, hash) {
				        if (!err)
				        	done(null, hash);
				        else
				        	done(err);
				    });
				else
					done(err);
			});
		},
		compareSecret:function(params, done){
			_this.internals.bcrypt.compare(params.hash, params.secret, function(err, res) {
				done(err, res);
			});
		},
		login:function(params, done){
			//login attempt is happening
			this.restack.dataHelper.find('User', {username:params.username}, function(err, user) { 
				try
				{
					if (err)
						throw err;
					
					if (user == null)
						throw _this.restack.messagesHelper.authenticationBadCredentials();
					
					_this.compareSecret({hash:user.secret, secret:params.secret}, function(err, res){
						if (!err && res)
						{
							//we generate a session token containing the username, and the expiry time
							var token = _this.encodeToken({username: user.username, name:user.name, ttl:_this.restack.settings.tokenttl, expires: _this.moment.unix() + (_this.restack.settings.tokenttl * 60), emailAddress: user.emailAddress, id: user.id},
									_this.restack.settings.authTokenSecret,
								function(e, token){
										done(e, token);
								});
							
						}
						else
					    	done(_this.restack.messagesHelper.authenticationBadCredentials());
					});
					
				}
				catch(e)
				{
					done(e);
				}
				
			});
		}
}

module.exports = authenticationHelper;