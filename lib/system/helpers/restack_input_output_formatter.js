module.exports = {
	internals : {
		standardHeaders : []
	},
	initialize:function(params, done){
		done();
	},
	writeResponse : function(err, res, req){

		var status	= 'OK';
		var payload = req.operation.payload;
		
		console.log("writeResponse");
		console.log(req.operation.payload);
		
		if (err) {
			status	= "FAILED";
			payload = err;
		}

		res.setHeader("X-Powered-By","restackJS");
		res.setHeader('Content-Type','application/json');
		res.setHeader("Access-Control-Allow-Origin", req.headers['host']);
		res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
		res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,POST");

		res.send({status:status, message:req.operation.message, data:payload}) ;

		//next();
	}
};