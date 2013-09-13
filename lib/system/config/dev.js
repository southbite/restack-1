var config = {
	port:7777,
	plugins:{
		cachePlugin:{plugin:require('../plugins/restack_cache'),options:{
			
		}},
		dataPlugin:{plugin:require('../plugins/restack_data'),options:{
			connectionURL:'mongodb://127.0.0.1:27017/restack'

		}},
		authPlugin:{plugin:require('../plugins/restack_auth'),options:{
			
		}},
		sessionPlugin:{plugin:require('../plugins/restack_session'),options:{

		}},
		inputOutputPlugin:{plugin:require('../plugins/restack_input_output_formatter'),options:{

		}}
	},
	middleware:{
		authentication:require('../middleware/authentication'),
		cache:require('../middleware/cache'),
		data:require('../middleware/data'),
		response:require('../middleware/response'),
		router:require('../middleware/router'),
		session:require('../middleware/session')
	}
}

module.exports = config;