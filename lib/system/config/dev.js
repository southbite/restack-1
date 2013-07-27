var config = {
	port:7777,
	plugins:{
		cache:{plugin:require('../plugins/restack_cache'),settings:{
			
		}},
		data:{plugin:require('../plugins/restack_data'),settings:{
			
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