var assignUpdateProperties = function(req, data)
{
	if (Array.isArray(data))
		assignUpdatePropertiesAll(req, data);
	else
	{
		data['lastupdatedBy'] = req.operation.credentials.account.id;
		data['lastupdatedOn'] = new Date();
	}
	
	return data;
}

var assignCreateProperties = function(req, data)
{
	if (Array.isArray(data))
		assignCreatePropertiesAll(req, data);
	else
	{
		if (req.operation.type != 'Account')
			data['account'] = req.operation.credentials.account.id;
		
		data['createdBy'] = req.operation.credentials.user.id;
		data['createdOn'] = new Date();
		data['deleted'] = false;
		data['systemVersion'] = 0;
	}
	
	return data;
}

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

var data = function (req,res,next) {

	this.restack.log('method ' + req.method + ' called in data, operation area: ' + req.operation.area);
	
	if (this[req.method] != null)
		this[req.method](req, res, next);
	else
		next();
}


data.POST = function (req, res, next)
{
	req.operation.data = assignCreateProperties(req, req.operation.data);
	
	this.restack.dataPlugin.create(req.operation.type, req.operation.data, function(err, results) { 
		
		//this.restack.log('did post restack is');
		//this.restack.log(this.restack);
		
		this.restack.log({msg:'POST successful payload: ' + JSON.stringify(results)});
		
		if (!err)
			req.operation.payload = results; 
		else
			this.restack.log('Data Create Error: ' + err);
		
		next(err); 
		
	}.bind(this));
	
}

data.PUT = function (req, res, next)
{
	req.operation.data = assignUpdateProperties(req, req.operation.data);
	
	this.restack.log('Doing update...');
	this.restack.log(req.operation.type);
	this.restack.log(req.operation.criteria);
	this.restack.log(req.operation.data);
	
	//(type, criteria, data, options, done)
	this.restack.dataPlugin.update(req.operation.type, req.operation.criteria, req.operation.data, {}, function(err, results) { 
			
		if (!err)
		{
			this.restack.log("Update successful...");
			this.restack.log(results);

			req.operation.payload = results; 
			
		}
		else
			this.restack.log('Data Update Error: ' + err);
		
		next(err); 
		
	}.bind(this));
}

data.GET = function (req, res, next)
{
	if (req.operation.cache.hit == true)
		next();
	else
	{
		this.restack.log('doing get with headers');
		this.restack.log(JSON.stringify(req.operation));
		this.restack.log(req.headers);
		
		if (!req.headers['include-deleted'])
			req.operation.criteria['deleted'] = false;
		
		this.restack.dataPlugin.find(req.operation.type, req.operation.criteria, function(err, data) { 
			
			if (!err)
				req.operation.payload = data; 
				
				this.restack.log('Data Error: ' + err);
			
				next(err); 
		}.bind(this));
	}
}

data.DELETE = function (req, res, next)
{	
	req.operation.data = assignDeleteProperties(req, req.operation.data);
	//remove:function(type, criteria, options, done) {
	
	var deleteOptions = {};
	
	if (req.headers['delete-type'] == 'hard')
		deleteOptions['hard'] = true;
	
	this.restack.dataPlugin.remove(req.operation.type, req.operation.criteria, deleteOptions, function(err, results) { 
		
		if (!err)
			req.operation.payload = results; 
		else
			this.restack.log('Data Update Error: ' + err);
		
		next(err); 
		
	}.bind(this));
}

module.exports = data;