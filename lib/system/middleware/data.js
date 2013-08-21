var data = function (req,res,next) {

	console.log('data called: ' + req.operation.name);
	
	if ([ 'find', 'getAll', 'getItemById', 'createItem', 'updateItem', 'deleteItem' ].indexOf(req.operation.name) != -1)
		{
			console.log("if: " + req.operation.name + "||" + this);
			console.log(this);
			this.handle[req.operation.name](req, next);
		}
	else 
		next();
}

data.getAll = function (req, next)
{
	console.log(this);
	this.restack["dataPlugin"].getAll(req.type, function(data) { console.log('getAllResponse: ' + data); req.operation.payload = data; next(); });
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