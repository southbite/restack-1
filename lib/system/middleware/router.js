var authRoutes = [ 'createAccount', 'confirmAccount', 'login', 'availableAccounts', 'permissions'];
var dataRoutes = [ 'model', 'find', 'findAll', 'findOne', 'getAll', 'getById', 'create', 'update', 'delete' ];

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
		console.log("route: " + route + ", request.name: " + req.operation.name);
		next();
	};
});

module.exports = router;