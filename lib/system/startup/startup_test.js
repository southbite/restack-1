module.exports = {
		params:null,
		restack:null,
		run:function(restack, params, done)
		{
			try
			{
				console.log('startup test started');
				console.log(restack.settings);
				console.log(restack.settings.plugins.dataHelper.options.connectionURL);
				
				var _this = this;
				
				var MongoClient = require('mongodb').MongoClient;
				
				MongoClient.connect(restack.settings.plugins.dataHelper.options.connectionURL, function(err, db) {
					if (err)
						done(err);
					else
					{
						db.dropDatabase(function(err, dropped) {
						        console.log('dropped db?');
						        console.log(err);
						        console.log(dropped);
						        
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
						 });
					}
			    });
				
				/*
				var mongodb = require('mongodb');
				var Db = mongodb.Db;
				var Server = mongodb.Server;
				
				 var client = new Db('restack_test_db', new Server("127.0.0.1", 27017, {}));
				
				 client.dropDatabase(function(err, dropped) {
				        console.log('dropped db?');
				        console.log(err);
				        console.log(dropped);
				        
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
				 });
				 */
				
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