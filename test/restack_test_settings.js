var config = {
	port:7777,
	plugins:{
		cacheHelper:{plugin:require('../lib/system/plugins/restack_cache'),options:{
			
		}},
		dataHelper:{plugin:require('../lib/system/plugins/restack_data'),options:{
			connectionURL:'mongodb://127.0.0.1:27017/test'

		}},
		authHelper:{plugin:require('../lib/system/plugins/restack_auth'),options:{
			
		}},
		sessionHelper:{plugin:require('../lib/system/plugins/restack_session'),options:{

		}},
		inputOutputHelper:{plugin:require('../lib/system/plugins/restack_input_output_formatter'),options:{

		}}
	},
	middleware:{

	},
	application_schema:require('./restack_test_schema')
}

module.exports = config;