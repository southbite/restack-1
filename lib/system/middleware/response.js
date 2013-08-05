/*
 * Packages the operation response
 */

var response = {
	write:function(status, data, message, res, req){
		res.setHeader("X-Powered-By","restackJS");
		res.setHeader("Access-Control-Allow-Origin",req.headers['host']); 
		res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
		res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,POST"); 
		
		res.send({'status':status, 'message':message, 'data':data}) ;
	},
	error:function(err, req, res, next){
		
		console.log('response middleware error called');
	
		var payload = (req.operation && req.operation.payload) ? req.operation.payload : null;
		
		this.restack.inputOutputPlugin.writeResponse(err, payload, null, res, req);
	},
	success:function (req, res, next) {

		console.log('response middleware success called');
		
		var payload = (req.operation && req.operation.payload) ? req.operation.payload : null;
		var message	= (req.operation && req.operation.message) ? req.operation.message : null;
		
		this.restack.inputOutputPlugin.writeResponse(null, payload, message, res, req);
	}
		
}

module.exports = response;