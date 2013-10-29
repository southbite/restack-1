var restack = {
	schema		: null,
	settings	: null,
	/*
	// These are dynamically added and not needed
	cacheHelper:null,
	dataHelper:null,
	authHelper:null,
	sessionHelper:null,
	*/
	port		: null,
	express		: null,
	http		: null,
	middleware	: {
		/*
		// These are dynamically added and dont need to be defined
		authentication:null,
		cache:null,
		service:null,
		data:null,
		headers:null,
		router:null,
		session:null,
		*/
	},
	initialize:function(params, done){
		
		//try
		//{
			
			if (params.settings != null)
				this.settings = params.settings;
			
			if (this.settings == null)
				this.settings = require('./system/config/dev');
			
			this.settings.operational = {cache_up:true};
			
			this.schema = require('./system/schema/base_schema');
			
			if (this.port == null)
				this.port = this.settings.port;


			// Generically registering these default plugins
			var standardHelpers = {
				cacheHelper			: './system/plugins/restack_cache',
				validationHelper	: './system/plugins/restack_validation',
				concurrencyHelper	: './system/plugins/restack_concurrency',
				dataHelper			: './system/plugins/restack_data',
				authorizationHelper	: './system/plugins/restack_authorization',
				authenticationHelper: './system/plugins/restack_authentication',
				inputOutputHelper	: './system/plugins/restack_input_output_formatter',
				notificationHelper	: './system/plugins/restack_notification',
				messagesHelper		: './system/plugins/restack_messages',
				dataCacheHelper		: './system/plugins/restack_data_cache',
				historyHelper		: './system/plugins/restack_history'
			};

			// Collate all the names, from the standard list and the settings
			var allHelperNames	= [];
			var loadedHelperNames	= {};
			var name;
			
			//we load the configured plugins
			for (var pluginName in this.settings.plugins){
				allHelperNames.push(pluginName);
				loadedHelperNames[pluginName] = true;
			}
			
			//we fill the gaps with the standard plugins
			for (var pluginName in standardHelpers){
				if (loadedHelperNames[pluginName] == undefined)
					allHelperNames.push(pluginName);
			}
			
			//console.log(allHelperNames);
			//console.log('this.settings.plugins');
			//console.log(this.settings.plugins);
			
			// Register all the plugins on the root object
			for (var pluginIndex in allHelperNames){
				
				var name = allHelperNames[pluginIndex]
				
				if (this.settings.plugins.hasOwnProperty(name) && this.settings.plugins[name]){
					this[name] = this.settings.plugins[name].plugin;
				}
				else {
					//console.log(allHelperNames[pluginIndex]);
					this[name] = require(standardHelpers[name]);
				}
				
				//so now the middleware items have access to restack itself, no longer needs to be a global
				this[name].restack = this;
			}


			// Standard middleware definitions
			var standardMiddleware = {
				authentication	: "./system/middleware/authentication",
				authorization	: "./system/middleware/authorization",
				cache			: "./system/middleware/cache",
				validation		: "./system/middleware/validation",
				concurrency		: "./system/middleware/concurrency",
				data			: "./system/middleware/data",
				router			: "./system/middleware/router",
				response		: "./system/middleware/response",
				history			: "./system/middleware/history"
			};

			// Register all the middleware modules, either using settings ones or the standard ones
			// Note: the middleware only registers the standard ones defined above, it doesn't include any undeclared items from the settings
			for (name in standardMiddleware){
				if (this.settings.middleware.hasOwnProperty(name) && this.settings.middleware[name]){
					this.middleware[name] = this.settings.middleware[name];
				}
				else{
					this.middleware[name] = require(standardMiddleware[name]);
				}
				
				//so now the middleware items have access to restack itself, no longer needs to be a global
				this.middleware[name].restack = this;
			}

			//console.log('dynamic init');
			//console.log(this);
			//console.log(allHelperNames.length);
			// Initialise all the plugins dynamically, then finally the schema
			var cnt = 0;
			var initHelper = function(e){
				if (e) {
					console.log('init error happened');
					done(e);
					return;
				}
				else
				{
					if (cnt < allHelperNames.length){
						var name		= allHelperNames[cnt];
						var plugin		= this[name];
						var settingsDef	= (this.settings.plugins.hasOwnProperty(name)) ? this.settings.plugins[name] : null;
						
						//console.log('settingsDef');
						//console.log(settingsDef);
						
						cnt++;
						//console.log('initializing');
						if (settingsDef && settingsDef.options){
							console.log('initializing with options');
							plugin.initialize(settingsDef.options, initHelper);
						}
						else{
							console.log('initializing');
							plugin.initialize(null, initHelper);
						}
					}
					else if (this.settings.hasOwnProperty("application_schema") && this.settings.application_schema) {
						console.log('adding external schema');
						console.log(this.settings.application_schema);
						this.schema.addExternal(this.settings.application_schema, function(e){
							
							if (!e)
								console.log('External schema bound OK');
							
							done(e);
						});
					}
					else{
						done();
					}
				}
				
			}.bind(this);
			
			initHelper();
			
		//}
		//catch(e)
		//{
		//	done(e);
		//}
		
	},
	start:function(done){
		
		//try
		//{
		
			this.express = require('express');
			this.http = require('http');
			
			var app = this.express()
			//.use(this.express.logger())
			.use(this.express.json())
			//.use(this.express.cookieParser())
			.all('/:area/:type', this.middleware.router.bind(this.middleware.router))

			.use(this.middleware.authentication.check.bind(this.middleware.authentication))
			.use(this.middleware.authorization.check.bind(this.middleware.authorization))
			.use(this.middleware.cache.check.bind(this.middleware.cache))
			.use(this.middleware.validation.bind(this.middleware.validation))
			.use(this.middleware.concurrency.check.bind(this.middleware.concurrency))
			.use(this.middleware.data.bind(this.middleware.data))
			.use(this.middleware.history.bind(this.middleware.history))
			.use(this.middleware.cache.update.bind(this.middleware.cache))
			.use(this.middleware.concurrency.update.bind(this.middleware.concurrency))
			.use(this.middleware.authorization.update.bind(this.middleware.authorization))
			.use(this.middleware.response.success.bind(this.middleware.response))
			.use(this.middleware.response.error.bind(this.middleware.response));

			this.settings.startupHelper.run(this, {}, function(e){
				if (!e)
				{
					this.http.createServer(app).listen(this.port);
					console.log('server listening on port ' + this.port);
					done();
				}
				else
					done(e);
			}.bind(this));
			
			
		//}
		//catch(e)
		//{
		//	done(e);
		//}
		
		
	},
	log:function(params, done){
		
		try
		{
			var msg;
			
			if (typeof params == "object")
				msg = params.msg;
			else
				msg = params;
			
			if (this.settings.loggingEnabled)
			{
				console.log(msg);
				if (done)
					done();
			}
		}
		catch(e)
		{
			done(e);
		}
	},
	systemCache:{}
}

module.exports = restack;