var async = require("async");

var assignUpdateProperties = function(req, data)
{
	if (Array.isArray(data))
		assignUpdatePropertiesAll(req, data);
	else
	{
		data['lastupdatedBy'] = req.operation.credentials.user.id;
		data['lastupdatedOn'] = new Date();
	}
	
	return data;
}

var assignCreateProperties = function(req, data)
{
	try
	{
		this.restack.log('assign create properties');
		this.restack.log(data);
		
		if (Array.isArray(data))
			assignCreatePropertiesAll(req, data);
		else
		{
			if (['Account','User', 'Login'].indexOf(req.operation.type) == -1)
				data['account'] = req.operation.credentials.accountId;
			
			if (['User', 'Login'].indexOf(req.operation.type) == -1)
				data['createdBy'] = req.operation.credentials.user.id;
			
			data['createdOn'] = new Date();
			data['deleted'] = false;
			data['systemVersion'] = 0;
		}
		
		return data;
	}
	catch(e)
	{
		this.restack.log('Failure assigning create properties ' + e);
		throw e;
	}
	
	
}

var getAuditObject = function(req, obj){
	return assignCreateProperties(req, {systemVersion:obj.systemVersion,objectId:obj.id,method:req.method });
};

var	getArchiveObject = function(req, obj){
	return assignCreateProperties(req, {systemVersion:obj.systemVersion,objectId:obj.id,method:req.method,data:obj});
};

var assignDeleteProperties = function(req, data)
{
	if (Array.isArray(data))
		assignDeletePropertiesAll(req, data);
	else
	{
		data['deleted'] = true;
		data['deletedBy'] = req.operation.credentials.user.id;
		data['deletedOn'] = new Date();
	}
	
	return data;
}

var assignUpdatePropertiesAll = function(req, data)
{
	for (var i = 0;i < data.length; i++)
		data[i] = assignUpdateProperties(req, data[i]);
	
	return data;
}

var assignCreatePropertiesAll = function(req, data)
{
	for (var i = 0;i < data.length; i++)
		data[i] = assignCreateProperties(req, data[i]);
	
	return data;
}

var assignDeletePropertiesAll = function(req, data)
{
	for (var i = 0;i < data.length; i++)
		data[i] = assignDeleteProperties(req, data[i]);
	
	return data;
}

var data_middleware = function (req, res, next) {

	this.restack.log('method ' + req.method + ' called in data_middleware');
	
	if (this[req.method] != null)
		this[req.method](req, res, function(e){
			this.restack.log('method ' + req.method + ' completed in data_middleware');
			next(e);
		});
	else
		next('Bad method: ' + req.method + ', must be GET,PUT,POST or DELETE');

}

data_middleware.POST = function (req, res, done)
{
	
	req.operation.data = assignCreateProperties(req, req.operation.data);
	
	this.restack.dataHelper.create(req.operation.type, req.operation.data, function(err, results) { 
		
		this.restack.log({msg:'POST successful payload: ' + JSON.stringify(results)});
		
		if (!err)
			req.operation.payload = results; 
		else
			this.restack.log('Data Create Error: ' + err);
		
		done(err); 
		
	}.bind(this));
	
}

data_middleware.PUT = function (req, res, done)
{
	req.operation.data = assignUpdateProperties(req, req.operation.data);
	
	this.restack.log('Doing update...');
	this.restack.log(req.operation.type);
	this.restack.log(req.operation.criteria);
	this.restack.log(req.operation.data);
	
	//(type, criteria, data, options, done)
	this.restack.dataHelper.update(req.operation.type, req.operation.criteria, req.operation.data, {}, function(err, results) { 
			
		if (!err)
		{
			this.restack.log("Update successful...");
			this.restack.log(results);
			
			req.operation.payload = {count:results}; 
			
		}
		else
			this.restack.log('Data Update Error: ' + err);
		
		done(err); 
		
	}.bind(this));
}


data_middleware.GET = function (req, res, done)
{

	if (req.operation.cache.hit == true)
		done();
	else
	{
		this.restack.log('doing get with headers');
		this.restack.log(req.headers);
		
		if (!req.headers['include-deleted'])
			req.operation.criteria['deleted'] = false;
		
		this.restack.dataHelper.find(req.operation.type, req.operation.criteria, function(err, data) { 
			
			if (!err)
			{
				//WHY AFTER THE CACHE UPDATE???
				req.operation.payload = data; 
				this.restack.log('payload added');
				this.restack.log(req.operation.payload);
			}	
			else
				this.restack.log('Data Error: ' + err);
			
			done(err); 
			
		}.bind(this));
	}

}


data_middleware.DELETE = function (req, res, next)
{	
	req.operation.data = assignDeleteProperties(req, req.operation.data);
	//remove:function(type, criteria, options, done) {
	
	var deleteOptions = {};
	
	if (req.headers['delete-type'] == 'hard')
		deleteOptions['hard'] = true;
	
	this.restack.dataHelper.remove(req.operation.type, req.operation.criteria, deleteOptions, function(err, results) { 
		
		if (!err)
			req.operation.payload = results; 
		else
			this.restack.log('Data Update Error: ' + err);
		
		next(err); 
		
	}.bind(this));
}

data_middleware.auditCheck = function(req,res,next){
	var _this = this;
	if (req.method == 'PUT')
	{
		/*
		You cannot record history entries when doing a PUT without an id in the criteria (as bulk updates do not return items in the payload)
		 */
		_this.restack.log('History middleware check called');
		//this.restack.log(this.restack.schema);
		//this.restack.log(this.restack.schema.model[req.operation.type]);
		var model = _this.restack.schema.model[req.operation.type];
		if (model && model.directives.history != null)
		{
			_this.restack.log('History check happening');
			
			if (req.operation.criteria.id == undefined)
				next(_this.restack.messagesHelper.historyCheckFailed(model.directives.history));
			else
				next();
		}
		else
			next();
	}
	else
		next();
};

data_middleware.audit = function(req,res,next){
	
	var _this = this;
	
	if (!_this.audit)
		_this.audit = function(req, obj, done){
			_this.restack.dataHelper.create('Audit/' + req.operation.type, getAuditObject(req, obj), function(e, audited){
				if (!e)
					done(null, audited[0]);
				else
					done(e);
			});
		};
	
	_this.restack.log('history update middleware called');
	
	//this.restack.log(this.restack.schema);
	
	if ([ 'PUT', 'POST', 'DELETE' ].indexOf(req.method) != -1 && req.operation.data != null)
	{
		_this.restack.log('history called for type ' + req.operation.type);
		_this.restack.log(_this.restack.schema.model[req.operation.type]);
		
		var model = _this.restack.schema.model[req.operation.type];
		
		if (model && model.directives != null && model.directives.history != null)
		{
				async.forEach(req.operation.payload, function(obj, callback) { 
				
					if (model.directives['history'] == 'audit')
					{
						_this.audit(req, obj, function(e){
							
							if (!e)
								callback();
							else
								callback(_this.restack.messagesHelper.historyUpdateFailed(model.directives.history, e));
							
						});
					}
					else if (model.directives['history'] == 'archive')
					{
						_this.restack.dataHelper.create('Archive/' + req.operation.type, getArchiveObject(req, obj), function(e, archive){
							if (!e)
								callback();
							else
								callback(_this.restack.messagesHelper.historyUpdateFailed(model.directives.history, e));
						});
					}
				
		    }, function(err) {
		    	if (!err)
		    	{
		    		next();
		    	}
				else
					next(err);
		    });
		}
		else
			next();
	}
	else 
		next();
};

module.exports = data_middleware;