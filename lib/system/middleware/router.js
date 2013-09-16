
/*
 * 
var authRoutes = [ 'createUser', 'confirmUser', 'linkUserToAccount', 'createRole', 'assignRole', 'createAccount', 'confirmAccount', 'login', 'availableAccounts', 'getRolePermissions', 'setRolePermissions'];
var dataRoutes = [ 'model', 'find', 'create', 'update', 'delete', 'getTypePermissions', 'setTypePermissions' ];

.post('/auth/user/create',this.middleware.router.createUser)
.get('/auth/user/confirm',this.middleware.router.confirmUser)
.post('/auth/user/link',this.middleware.router.linkUserToAccount)
.post('/auth/role/create',this.middleware.router.createRole)
.post('/auth/role/assign',this.middleware.router.assignRole)
.post('/auth/account/create',this.middleware.router.createAccount)
.post('/auth/account/confirm',this.middleware.router.confirmAccount)
.post('/auth/account/login',this.middleware.router.login)
.get('/auth/account/available',this.middleware.router.availableAccounts)
.get('/auth/role/getpermissions',this.middleware.router.getRolePermissions)
.post('/auth/role/setpermissions',this.middleware.router.setRolePermissions)

.get('/:area/:type/getpermissions',this.middleware.router.getTypePermissions)
.post('/:area/:type/setpermissions',this.middleware.router.setTypePermissions)
.get('/:area/:type/getmodel', this.middleware.router.model)
.get('/:area/:type/find', this.middleware.router.find)
.post('/:area/:type/create', this.middleware.router.create)
.put('/:area/:type/update', this.middleware.router.update)
.delete('/:type/delete', this.middleware.router['delete'])
*/
var str = require('string');

var routes = {
	'auth':{create:['user','role','account'],
		confirm:['user','account'],
		link:['user','role'],
		getpermissions:['role'],
		getpermissions:['role'],
		find:['user','role','account']},
	'data':{getpermissions:['*'],
		  	setpermissions:['*'],
		  	getmodel:['*'],
		  	find:['*'],
		  	create:['*'],
		  	update:['*'],
		  	'delete':['*']
		}
}

var router = function(req, res, next) {
			
	
	
			console.log("routing...");
			console.log(this.routes);
			
			var area = req.params.area.toLowerCase();
			var type = str(req.params.type.toLowerCase()).capitalize().s;
			var verb = req.params.verb.toLowerCase();;
			
			if (routes[area] == undefined)
				next('Bad Route: invalid area ' + area);
			
			if (routes[area][verb] == undefined)
				next('Bad Route: invalid verb ' + verb);
			
			if (routes[area][verb][0] != '*' && routes[area][verb][type] == undefined)
				next('Bad Route: invalid type ' + type);
			
			req.operation = req.operation || {};
			req.operation.area = area;
			req.operation.verb = verb;
			req.operation.type = type;

			req.operation.data = req.body || null;
			req.operation.criteria = req.query || null;
			
			console.log("area: " + area + ", type: " + type + ", verb: " + req.operation.verb);
			console.log(req.operation);
			
			next();
			
		}

module.exports = router;