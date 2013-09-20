var restack = {
	schema		: null,
	settings	: null,
	/*
	// These are dynamically added and not needed
	cachePlugin:null,
	dataPlugin:null,
	authPlugin:null,
	sessionPlugin:null,
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
		
		try
		{
			
			if (params.settings != null)
				this.settings = params.settings;
			
			if (this.settings == null)
				this.settings = require('./system/config/dev');
			
			this.schema = require('./system/schema/base_schema');
			
			if (this.port == null)
				this.port = this.settings.port;


			// Generically registering these default plugins
			var standardPlugins = {
				cachePlugin			: './system/plugins/restack_cache',
				dataPlugin			: './system/plugins/restack_data',
				authPlugin			: './system/plugins/restack_auth',
				sessionPlugin		: './system/plugins/restack_session',
				inputOutputPlugin	: './system/plugins/restack_input_output_formatter',
				historyPlugin		: './system/plugins/restack_history'
			};

			// Collate all the names, from the standard list and the settings
			var allPluginNames	= [];
			var name;
			for (name in this.settings.plugins){
				allPluginNames.push(name);
			}
			for (name in standardPlugins){
				allPluginNames.push(name);
			}

			//console.log(allPluginNames);
			//console.log('this.settings.plugins');
			//console.log(this.settings.plugins);
			
			// Register all the plugins on the root object
			for (var pluginIndex in allPluginNames){
				
				var name = allPluginNames[pluginIndex]
				
				if (this.settings.plugins.hasOwnProperty(name) && this.settings.plugins[name]){
					this[name] = this.settings.plugins[name].plugin;
				}
				else {
					//console.log(allPluginNames[pluginIndex]);
					this[name] = require(standardPlugins[name]);
				}
				
				//so now the middleware items have access to restack itself, no longer needs to be a global
				this[name].restack = this;
			}


			// Standard middleware definitions
			var standardMiddleware = {
				authentication	: "./system/middleware/authentication",
				cache			: "./system/middleware/cache",
				data			: "./system/middleware/data",
				router			: "./system/middleware/router",
				session			: "./system/middleware/session",
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
			//console.log(allPluginNames.length);
			// Initialise all the plugins dynamically, then finally the schema
			var cnt = 0;
			var initPlugin = function(e){
				if (e) {
					//console.log('init error happened');
					done(e);
					return;
				}
				else
				{
					if (cnt < allPluginNames.length){
						var name		= allPluginNames[cnt];
						var plugin		= this[name];
						var settingsDef	= (this.settings.plugins.hasOwnProperty(name)) ? this.settings.plugins[name] : null;
						
						//console.log('settingsDef');
						//console.log(settingsDef);
						
						cnt++;
						//console.log('initializing');
						if (settingsDef && settingsDef.options){
							//console.log('initializing with options');
							plugin.initialize(settingsDef.options, initPlugin);
						}
						else{
							//console.log('initializing');
							plugin.initialize(null, initPlugin);
						}
					}
					else if (this.settings.hasOwnProperty("application_schema") && this.settings.application_schema) {
						this.schema.addExternal(this.settings.application_schema, function(e){
							done(e);
						});
					}
					else{
						done();
					}
				}
				
			}.bind(this);
			
			initPlugin();
			
		}
		catch(e)
		{
			done(e);
		}
		
	},
	start:function(done){
		
		//try
		//{
		
			this.express = require('express');
			this.http = require('http');
			
			var app = this.express()
			.use(this.express.logger())
			.use(this.express.json())
			.use(this.express.cookieParser())
			.all('/:area/:type', this.middleware.router)
			.use(this.middleware.session)
			.use(this.middleware.authentication)
			.use(this.middleware.cache.check)
			.use(this.middleware.data)
			.use(this.middleware.history)
			.use(this.middleware.cache.update)
			.use(this.middleware.response.success.bind(this.middleware.response))
			.use(this.middleware.response.error.bind(this.middleware.response));

			this.http.createServer(app).listen(this.port);

			console.log('server listening on port ' + this.port);
			
			done();
		//}
		//catch(e)
		//{
		//	done(e);
		//}
		
		
	},
	log:function(log){
		if (this.settings.loggingEnabled)
			console.log(log);
	}
}

module.exports = restack;