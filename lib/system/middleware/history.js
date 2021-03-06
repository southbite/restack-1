var history = function (req,res,next) {

	var _this = this;
	
	_this.restack.log('history update middleware called');
	
	//this.restack.log(this.restack.schema);
	
	if ([ 'PUT', 'POST', 'DELETE' ].indexOf(req.method) != -1 && req.operation.data != null)
	{
		_this.restack.log('history called for type ' + req.operation.type);
		
		//this.restack.log(JSON.stringify(this.restack.schema.model));
		//this.restack.log(this.restack.schema.model[req.operation.type]);
		_this.restack.log(_this.restack.schema.model[req.operation.type]);
		
		var model = _this.restack.schema.model[req.operation.type];
		
		if (model && model.directives != null)
		{
			if (model.directives['history'] == 'audit')
			{
				//we create an audit object using the history plugin
				_this.restack.historyHelper.audit(req.operation, function(e){
					next(e);
				});
			}
			else
			if (model.directives['history'] == 'archive')
			{
				//we create an archive object using the history plugin
				_this.restack.historyHelper.archive(req.operation, function(e){
					next(e);
				});
			}
			else
				next();
			
		}
		else
			next();
	}
	else 
		next();
}

module.exports = history;