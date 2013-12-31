var config = {
	port:7777,
	plugins:{
		cacheHelper:{plugin:require('../helpers/restack_cache'),options:{
			ip:'127.0.0.1',
			port:6379,
			dbKey:'restack_test_cache'
		}},
		dataHelper:{plugin:require('../helpers/restack_data'),options:{
			connectionURL:'mongodb://127.0.0.1:27017/restack_test_db'

		}},
		notificationHelper:{plugin:require('../helpers/restack_notification'),options:{
			mailGunKey:'key-3pz3fcf5itq0ze99hwjkyiuswiw3i3l0',
			emailFromAddress:'support@restack.net'
		}},
		pubSubHelper:{plugin:require('../helpers/restack_pubsub'),options:{
			ip:'127.0.0.1',
			port:6380,
			dbKey:'restack_test_pubsub'
		}}
	},
	middleware:{
		authentication:require('../middleware/authentication'),
		authorization:require('../middleware/authorization'),
		cache:require('../middleware/cache'),
		data:require('../middleware/data'),
		response:require('../middleware/response'),
		router:require('../middleware/router')
	},
	loggingEnabled:true,
	dynamicTypesEnabled:true,
	application_schema:require('./restack_test_schema'),
	authTokenSecret:'a256a2fd43bf441483c5177fc85fd9d3',
	baseURL:'http://localhost:7777',
	allowConfirmKeyPassback:true, //Unsecure - must not be true in production
	startupHelper:require('../startup/startup_test'),
	applicationName:'Restack Test',
	tokenttl:30
}

module.exports = config;