var pubsub_helper = {
	internals:{
		redis:null,
		client:null,
		params:null,
		ip:null,
		port:null,
		async:null
	},
	initialize:function(params, done)
	{
		this.internals.redis = require("redis");
		this.internals.async = require("async");

		console.log('init pubsub');
		
		if (params['dbKey'] == null)
			done('dbKey parameter is missing');

		if (params['ip'] == null)
			params.ip = '127.0.0.1';

		if (params['port'] == null)
			params.port = 6379;

		if (params['options'] == null)
			params.options = null;

		this.internals.params = params;
	    this.internals.client = this.internals.redis.createClient(this.internals.params.port, this.internals.params.ip, this.internals.params.options);
		
		done();
	},
	emit:function(params, done){
		
		var channel = this.internals.params.dbKey + '_' + params.channel;
		var data = JSON.stringify(params.data);
		this.internals.client.publish(channel, JSON.stringify(params.data), function(e){
			this.restack.log('operation emmitted for pub sub channel: ' + channel);
			this.restack.log('operation emmitted for pub sub data: ' + data);
			done(e);
		});
	}
}

module.exports = pubsub_helper;