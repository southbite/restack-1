var assignUpdateProperties = function(req, data)
{
	if (Array.isArray(data))
		assignUpdatePropertiesAll(req, data);
	else
	{
		data['lastupdatedBy'] = req.operation.session.account.id;
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
		data['account'] = req.operation.session.account.id;
		data['createdBy'] = req.operation.session.user.id;
		data['createdOn'] = new Date();
	}
	
	return data;
}

var assignDeleteProperties = function(req, data)
{
	if (Array.isArray(data))
		assignDeletePropertiesAll(req, data);
	else
	{
		data['deletedBy'] = req.operation.session.user.id;
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

	console.log('method ' + req.method + ' called in data, operation area: ' + req.operation.area);
	
	if (req.operation.area == 'data' && this.handle[req.method] != null)
		this.handle[req.method](req, res, next);
	else
		next();
}


data.POST = function (req, res, next)
{
	//we get the session info from the operation (userid, sessionid, accountid)
	//owner=userid
	//accountid=accountid
	//create:function(type, data, done) {
	req.operation.data = assignCreateProperties(req, req.operation.data);
	
	this.restack.dataPlugin.create(req.operation.type, req.operation.data, function(err, results) { 
		
		if (!err)
			req.operation.payload = results; 
		else
			console.log('Data Create Error: ' + err);
		
		next(err); 
		
	});
	
}

data.PUT = function (req, res, next)
{
	//we get the session info from the operation (userid, sessionid, accountid)
	//owner=userid
	//accountid=accountid
	
	req.operation.data = assignUpdateProperties(req, req.operation.data);
	
	//(type, criteria, data, options, done)
	this.restack.dataPlugin.update(req.operation.type, req.operation.criteria, req.operation.data, {}, function(err, results) { 
			
		if (!err)
			req.operation.payload = results; 
		else
			console.log('Data Update Error: ' + err);
		
		next(err); 
		
	});
}

data.GET = function (req, res, next)
{
	this.restack.dataPlugin.find(req.operation.type, req.operation.criteria, function(err, data) { 
		
		if (!err)
			req.operation.payload = data; 
			
			console.log('Data Error: ' + err);
		
			next(err); 
	});
}

data.DELETE = function (req, res, next)
{	
	req.operation.data = assignDeleteProperties(req, req.operation.data);
	//remove:function(type, criteria, options, done) {
	
	var deleteOptions = {};
	
	if (req.header('Delete-Type') == 'hard')
		deleteOptions['hard'] = true;
	
	this.restack.dataPlugin.remove(req.operation.type, req.operation.criteria, {}, function(err, results) { 
		
		if (!err)
			req.operation.payload = results; 
		else
			console.log('Data Update Error: ' + err);
		
		next(err); 
		
	});
}

/*
function find() 
{
}

function getItemById() 
{
}

function createItem() 
{
}

function updateItem()
{
}

function deleteItem() 
{
}
*/
module.exports = data;