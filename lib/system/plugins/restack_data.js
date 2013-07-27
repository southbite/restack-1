var data_helper = {
	internals:{
	},
	connected:false,
	initialize:function(params, done)
	{
		//done('Not implemented');
		done();
	},
	getType:function(type, done){
		done('Not implemented');
	},
	find:function(type, criteria, done)
	{
		done('Not implemented');
	},
	findIn:function(type, columnName, matchValues, done)
	{
		done('Not implemented');
	},
	findOne:function(type, criteria, done)
	{
		done('Not implemented');
	},
	getById:function(type, id, done)
	{
		done('Not implemented');
	},
	getAll:function(type, done)
	{
		done('Not implemented');
	},
	create:function(type, obj, done) {
		done('Not implemented');
	},
	update_criteria:function(type, criteria, obj, done) {
		done('Not implemented');
	},
	update:function(id, type, obj, done) {
		done('Not implemented');
	},
	destroy:function(type, id, done) {
		done('Not implemented');
	}
}

module.exports = data_helper;