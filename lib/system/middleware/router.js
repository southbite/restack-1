var authRoutes = [ 'createUser', 'confirmUser', 'createRole', 'assignRole', 'createAccount', 'confirmAccount', 'login', 'availableAccounts', 'getRolePermissions', 'setRolePermissions'];
var dataRoutes = [ 'model', 'find', 'findAll', 'findOne', 'getAll', 'getById', 'create', 'update', 'delete', 'getTypePermissions' ];

var router = {	
	check:function (req,res,next) {
		next(req.operation ? null : 'Path not valid');
	}
}

dataRoutes.concat(authRoutes).forEach(function(route) {
	router[route] = function(req, res, next) {
		console.log("routing...");
		req.operation = req.operation || {};
		req.operation.name = req.operation.name || route;
		req.operation.type = req.params.type;
		req.operation.id = req.params.id || null;
		req.operation.data = req.body || null;
		req.operation.criteria = req.query || null;
		
		console.log("route: " + route + ", request.name: " + req.operation.name);
		console.log(req.operation);
		
		next();
	};
});

module.exports = router;