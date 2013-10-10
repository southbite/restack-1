/*
 * Packages the operation response
 */

var response = {
	error:function(err, req, res, next){
		
		this.restack.log('response middleware error called');
		var payload = (req.operation && req.operation.payload) ? req.operation.payload : null;
		
		this.restack.inputOutputPlugin.writeResponse(err, res, req);
	},
	success:function (req, res, next) {

		this.restack.log('response middleware success called');
		
		var payload = (req.operation && req.operation.payload) ? req.operation.payload : null;
		var message	= (req.operation && req.operation.message) ? req.operation.message : null;
		
		this.restack.inputOutputPlugin.writeResponse(null, res, req);
	}
		
}

module.exports = response;