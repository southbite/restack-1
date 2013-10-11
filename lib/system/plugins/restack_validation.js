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
	validateRequest:function(type, data, done){
		
		this.restack.log("Validation plugin running");
		//this.restack.log(this);
		var validationResult = {valid:true, checks:[]};
		var model = this.restack.schema.model[type];
		var dataArray = [];
		
		if (!Array.isArray(data))
			dataArray.push(data);//turn it into an array so we dont repeat ourselves
		else
			dataArray = data;
		
		if (model != null)
		{
			for (var dataItemIndex in dataArray)
			{
				var dataItemInstance = dataArray[dataItemIndex];
				var currentCheck = {};
				
				for (var propertyName in model.constraints)
				{
					this.restack.log(dataItemIndex);
					this.restack.log(dataItemInstance);
					this.restack.log(propertyName);
					
					var constraint = model.constraints[propertyName];
					
					if (constraint.required == true && (dataItemInstance[propertyName] == null || dataItemInstance[propertyName] == undefined || dataItemInstance[propertyName].toString() == ''))
					{
						validationResult.valid = false;
						currentCheck[propertyName] = "Required constraint violated for property: " + propertyName;
					}
					
					if (this.internals.checkType(constraint, dataItemInstance[propertyName]) == false)
					{
						validationResult.valid = false;
						currentCheck[propertyName] = "Type constraint violated for property: " + propertyName + ", expected type: " + constraint.type;
					}
					
				}
				
				this.restack.log(currentCheck);
				validationResult.checks.push(currentCheck);
			}
		}
		
		if (validationResult.valid)
			done();
		else
			done(validationResult);
		
	}
}

module.exports = validation_helper;