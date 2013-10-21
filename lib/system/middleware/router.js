
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
		'auth':{POST:['user','role','account','userrole','useraccount'],
				GET:['user','role','account','userconfirm','accountconfirm','rolepermission'],
				PUT:['user','role','account'],
				DELETE:['user','role','account','rolepermission']
			},
		'data':{POST:['*'],
			GET:['*'],
			PUT:['*'],
			DELETE:['*']
		}
}

var router = function(req, res, next) {
			
			this.restack.log("routing...");
			//this.restack.log(this.routes);
			
			var area = req.params.area.toLowerCase();
			//var type = str(req.params.type.toLowerCase()).capitalize().s;
			var type = req.params.type;
			
			if (routes[area] == undefined)
				next('Bad Route: invalid area ' + area);
			
			if (routes[area][req.method] == undefined)
				next('Bad Route: invalid method ' + req.method + ', for area ' + area);
			
			if (routes[area][req.method][0] != '*' && routes[area][req.method][type] == undefined)
				next('Bad Route: invalid type ' + type + ', for area ' + area);
			
			req.operation = req.operation || {};
			req.operation.area = area;
			req.operation.type = type;

			req.operation.data = req.body || null;
			req.operation.criteria = req.query || {};
			
			this.restack.log("area: " + area + ", type: " + type + ", method: " + req.method);
			//this.restack.log(req.operation);
			
			next();
			
		}

module.exports = router;