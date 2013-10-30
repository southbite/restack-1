var router = function(req, res, next) {
			
			this.restack.log("routing...");
			//this.restack.log(this.routes);
		
			var type = req.params.type;
			
			req.operation = req.operation || {};
			req.operation.type = type;

			req.operation.data = req.body || null;
			req.operation.criteria = req.query || {};
			
			this.restack.log({msg:"type: " + type + ", method: " + req.method + ", criteria " + req.operation.criteria, module:"router middleware"});
			console.log(req.operation.criteria);
			console.log(req.operation.data);
			//this.restack.log(req.operation);
			
			next();
			
		}

module.exports = router;