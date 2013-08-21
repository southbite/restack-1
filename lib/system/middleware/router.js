var routes = [ 'createAccount', 'confirmAccount', 'login', 'availableAccounts', 'getPermissions', 
                    'getModel', 'find', 'getAll', 'getItemById', 'createItem', 'updateItem', 'deleteItem' ];


var router = {	
	check:function (req,res,next) {
		console.log('check called');
		next(req.operation.name ? null : 'Path not valid');
	}
}

routes.forEach(function(route) {
	router[route] = function(req, res, next) {
		req.operation = req.operation || {};
		req.operation.name = req.operation.name || route;
		console.log("route: " + route + ", request.name: " + req.operation.name);
		next();
	};
});

module.exports = router;