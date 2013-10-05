var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var ObjectID = require('mongodb').ObjectID;

var validation_helper = {
	internals:{
		checkType:function(constraint, property){
			
			if (property != null)
			{
				return (Object.prototype.toString.call(property) == "[object " + constraint.type + "]")
			}
			else
				return true;
			
		}
	},
	initialize:function(params, done)
	{
		done();
	},
	validateRequest:function(data, done){
		
		var validationResult = {valid:true, checks:{}};
		var model = this.hande.restack.schema.model[req.operation.type];
		
		if (model != null)
		{
			for (var propertyName in model.constraints)
			{
				validationResult.checks[propertyName] = "";
				var constraint = model.constraints[propertyName];
				
				if (constraint.required == true && (schemaObject[propertyName] == null || schemaObject[propertyName] == undefined || schemaObject[propertyName].toString() == ''))
				{
					validationResult.valid = false;
					validationResult.checks[propertyName] += "Required constraint violated for property: " + propertyName + "\r\n";
				}
				
				if (this.internals.checkType(constraint, schemaObject[propertyName]) == false)
				{
					validationResult.valid = false;
					validationResult.checks[propertyName] += "Type constraint violated for property: " + propertyName + ", expected type: " + constraint + "\r\n";
				}
					
					
			}
		}
		
		if (validationResult.valid)
			done();
		else
			done(validationResult);
		
	}
}

module.exports = validation_helper;