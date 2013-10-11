/*
 * Packages the operation response
 */

var response = {
	error:function(err, req, res, next){
		
		this.restack.log('response middleware error called');	
		this.restack.inputOutputPlugin.writeResponse(err, res, req);
	},
	success:function (req, res, next) {

		this.restack.log('response middleware success called');
		this.restack.inputOutputPlugin.writeResponse(null, res, req);
	}
		
}

module.exports = response;