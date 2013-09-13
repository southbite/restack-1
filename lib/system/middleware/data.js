var data = function (req,res,next) {

	console.log('data called: ' + req.operation.name);
	
	if ([ 'find', 'findOne', 'getAll', 'getItemById', 'createItem', 'updateItem', 'deleteItem' ].indexOf(req.operation.name) != -1)
	{
		this.handle[req.operation.name](req, next);
	}
	else 
		next();
}

data.find = function (req, next)
{
	this.handle.restack.dataPlugin.find(req.type, req.body, function(data) { 
			req.operation.payload = data; 
			next(); 
	});
}

data.findOne = function (req, next)
{
	this.handle.restack.dataPlugin.findOne(req.type, req.body, function(data) { 
			req.operation.payload = data; 
			next(); 
	});
}

data.getAll = function (req, next)
{
	this.handle.restack.dataPlugin.getAll(req.type, function(data) { 
			req.operation.payload = data; 
			next(); 
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