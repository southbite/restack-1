module.exports = {
		params:null,
		run:function(restack, params, done)
		{
			try
			{
				this.params = params;
				
				this.initializeMasterAccount(function(e, accountDetails){
					
					if (!e)
					{
						this.initializeMasterAdminUser(function(e, adminUserDetails){
							done(e);
						});
					}
					else
						done('Error initializing master account: ' + e.toString());
					
				});
				
				done();
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
		}
}