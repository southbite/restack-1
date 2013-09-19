var history = function (req,res,next) {

	console.log('history called: ' + req.operation.name);
	console.log(this.handle.restack.schema);
	
	if ([ 'PUT', 'POST', 'DELETE' ].indexOf(req.method) != -1 && req.operation.data != null)
	{
		if (this.handle.restack.schema.directives.history[req.operation.type] == 'audit')
		{
			//we create an audit object using the history plugin
			this.handle.restack.historyPlugin.audit(req.operation, function(e){
				next(e);
			});
		}
		else
		if (this.handle.restack.schema.directives.history[req.operation.type] == 'archive')
		{
			//we create an archive object using the history plugin
			this.handle.restack.historyPlugin.archive(req.operation, function(e){
				next(e);
			});
		}
		else
			next();
	}
	else 
		next();
}

module.exports = history;