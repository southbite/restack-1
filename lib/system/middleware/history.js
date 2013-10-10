var history = function (req,res,next) {

	this.handle.restack.log('history called for type ' + req.operation.type);
	//this.handle.restack.log(this.handle.restack.schema);
	
	if ([ 'PUT', 'POST', 'DELETE' ].indexOf(req.method) != -1 && req.operation.data != null)
	{
		if (this.handle.restack.schema.model[req.operation.type] != null)
		{
			if (this.handle.restack.schema.model[req.operation.type].directives['history'] == 'audit')
			{
				//we create an audit object using the history plugin
				this.handle.restack.historyPlugin.audit(req.operation, function(e){
					next(e);
				});
			}
			else
			if (this.handle.restack.schema.model[req.operation.type].directives['history'] == 'archive')
			{
				//we create an archive object using the history plugin
				this.handle.restack.historyPlugin.archive(req.operation, function(e){
					next(e);
				});
			}
			else
				next();
			
		}
	}
	else 
		next();
}

module.exports = history;