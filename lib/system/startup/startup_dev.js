module.exports = {
		params:null,
		restack:null,
		run:function(restack, params, done)
		{
			try
			{
				var _this = this;
				_this.params = params;
				_this.restack = restack;
				_this.initializeMasterAccount(function(e, accountDetails){
					
					if (!e)
					{
						_this.initializeMasterAdminUser(function(e, adminUserDetails){
							if (!e)
								_this.restack.log("Startup script ran successfully");
							
							done(e);
						});
					}
					else
						done('Error initializing master account: ' + e.toString());
					
				});
			}
			catch(e)
			{
				done(e);
			}
		},
		initializeMasterAccount:function(done){
			done();
		},
		initializeMasterAdminUser:function(done){
			done();
		},
		initializeMasterRoles:function(done){
		
			done();
		}
}