var config = {
	port:7777,
	plugins:{
		cachePlugin:{plugin:require('../lib/system/plugins/restack_cache'),options:{
			
		}},
		dataPlugin:{plugin:require('../lib/system/plugins/restack_data'),options:{
			connectionURL:'mongodb://127.0.0.1:27017/test'

		}},
		authPlugin:{plugin:require('../lib/system/plugins/restack_auth'),options:{
			
		}},
		sessionPlugin:{plugin:require('../lib/system/plugins/restack_session'),options:{

		}},
		inputOutputPlugin:{plugin:require('../lib/system/plugins/restack_input_output_formatter'),options:{

		}}
	},
	middleware:{

	},
	application_schema:require('./restack_test_schema')
}

module.exports = config;