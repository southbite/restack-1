var config = {
	port:7777,
	plugins:{
		cache:{settings:{
			
		}},
		data:{settings:{
			connectionURL:'mongodb://127.0.0.1:27017/test'
		}},
		authentication:{settings:{
			
		}},
		session:{settings:{
			
		}}
	},
	middleware:{

	},
	application_schema:require('./restack_test_schema')
}

module.exports = config;