var data = function (req,res,next) {

	console.log('data called: ' + req.operation.verb);
	
	if (this.handle[req.operation.verb] != null)
		this.handle[req.operation.verb](req, res, next);
	else
		next();
}


data.create = function (req, res, next)
{
	//we get the session info from the operation (userid, sessionid, accountid)
	//owner=userid
	//accountid=accountid
	
	req.operation.data['owner'] = req.operation.session.userid;
	
}

data.find = function (req, res, next)
{
	this.restack.dataPlugin.find(req.operation.type, req.operation.criteria, function(err, data) { 
		
		if (!err)
			req.operation.payload = data; 
			
			console.log('Data Error: ' + err);
		
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