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
		this.write('FAILED', 
				   (req['operation'] != null && req['operation']['payload'] != null)?req['operation']['payload']:null,
				   err.toString(),
				   res, req);
	},
	success:function (req, res, next) {

		this.write('OK',
				(req['operation'] != null && req['operation']['payload'] != null)?req['operation']['payload']:null,
				(req['operation'] != null && req['operation']['message'] != null)?req['operation']['message']:null,
				 res, req);
			
		}
}

module.exports = response;