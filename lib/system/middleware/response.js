/*
 * Packages the operation response
 */

var response = function (err, req, res, next) {

	console.log('response called');
	
	var status = 'OK';
	var data = null;
	var message = null;
	
	if (req['operation'] != null && req['operation']['payload'] != null)
		data = req['operation']['payload'];
	
	if (err)
	{
		message = err.toString();
	}
	else
	{
		if (req['operation'] != null && req['operation']['message'] != null)
			message = req['operation']['message'];
	}
	
	res.setHeader("X-Powered-By","restackJS");
	res.setHeader("Access-Control-Allow-Origin",req.headers['host']); 
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,POST"); 
	
	res.send({'status':status, 'message':message, 'data':data}) ;
}

module.exports = response;