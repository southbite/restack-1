var historyHelper = {
		internals:{},
		initialize:function(params, done){
			//done('Not implemented');
			done();
		},
		audit: function(params, done){
			//we save the operation without its data
			this.restack.log('audit not implemented');
			done();
		},
		archive: function(params, done){
			//we save the operation with its data
			this.restack.log('archive not implemented');
			done();
		}
}

module.exports = historyHelper;