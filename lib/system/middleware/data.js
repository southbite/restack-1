var data = function (req,res,next) {

	console.log('data called: ' + req.operation.name);
	
	if ([ 'model', 'find', 'findOne', 'getAll', 'getById', 'create', 'update', 'delete', 'permissions' ].indexOf(req.operation.name) != -1 && req.operation.cache.hit == false)
	{
		this.handle[req.operation.name](req, next);
	}
	else 
		next();
}


data.create = function (req, next)
{
	//we get the session info from the operation (userid, sessionid, accountid)
	//owner=userid
	//accountid=accountid
	
	req.operation.data['owner'] = req.operation.session.userid;
	
}

data.find = function (req, next)
{
	this.restack.dataPlugin.find(req.operation.type, req.operation.criteria, function(err, data) { 
		
		if (!err)
			req.operation.payload = data; 
			
			next(err); 
	});
}

data.findOne = function (req, next)
{
	this.restack.dataPlugin.findOne(req.operation.type, req.operation.data, function(err, data) { 
		if (!err)
			req.operation.payload = data; 
			
			next(err); 
	});
}

data.getAll = function (req, next)
{
	console.log('doing getAll');
	console.log(req.operation);
	
	this.restack.dataPlugin.getAll(req.operation.type, function(err, data) { 
		if (!err)
			req.operation.payload = data; 
			
			next(err); 
	});
}

data.getById = function (req, next)
{
	this.restack.dataPlugin.findOne(req.operation.type, {id:req.operation.id}, function(err, data) { 
		if (!err)
			req.operation.payload = data; 
			
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