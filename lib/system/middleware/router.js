var router = function(req, res, next) {
			
			this.restack.log("routing...");
			this.restack.log("req.query");
			this.restack.log(req.query);
			
			var type = req.params.type;
			
			req.operation = req.operation || {};
			req.operation.type = type;

			req.operation.data = req.body || null;
			
			//in case we are just pushing an object that has an id up
			if (req.method == 'PUT' && Object.getOwnPropertyNames(req.query).length === 0 && req.body != null && req.body.id != null)
			{
				this.restack.log("No criteria - but id found");
				req.operation.criteria = {id:req.body.id};
			}
			else
				req.operation.criteria = req.query || {};
			
			this.restack.log({msg:"type: " + type + ", method: " + req.method + ", criteria " + req.operation.criteria, module:"router middleware"});
			
			console.log(req.operation.criteria);
			console.log(req.operation.data);
			//this.restack.log(req.operation);
			
			next();
			
		}

module.exports = router;