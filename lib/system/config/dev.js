var config = {
	port:7777,
	plugins:{
		cache:{plugin:require('../plugins/restack_cache'),settings:{
			
		}},
		data:{plugin:require('../plugins/restack_data'),settings:{
			//we now have the connectionURL setting for the data plugin
			connectionURL:'mongodb://127.0.0.1:27017/test'
		}},
		authentication:{plugin:require('../plugins/restack_auth'),settings:{
			
		}},
		session:{plugin:require('../plugins/restack_session'),settings:{
			
		}}
	},
	middleware:{
		authentication:require('../middleware/authentication'),
		cache:require('../middleware/cache'),
		data:require('../middleware/data'),
		headers:require('../middleware/response'),
		router:require('../middleware/router'),
		session:require('../middleware/session')
	}
}

module.exports = config;