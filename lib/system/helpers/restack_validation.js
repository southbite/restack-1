var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var ObjectID = require('mongodb').ObjectID;

var validation_helper = {
	internals:{
		async:null,
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
		this.internals.async = require("async");
		done();
	},
	validateRequest:function(type, data, done){
		var _this = this;
		_this.restack.log("Validation plugin running");
		console.log(data);

		var model = _this.restack.schema.model[type];
		
		if (model != null && model.constraints != null && Object.getOwnPropertyNames(model.constraints).length > 0)
		{
			var dataArray = [];
			
			if (!Array.isArray(data))
				dataArray.push(data);//turn it into an array so we dont repeat ourselves
			else
				dataArray = data;
			
			for (var dataItemIndex in dataArray)
			{
				var dataItemInstance = dataArray[dataItemIndex];
				
				for (var propertyName in model.constraints)
				{
					var constraint = model.constraints[propertyName];
					
					if (constraint.required == true && (dataItemInstance[propertyName] == null || dataItemInstance[propertyName] == undefined || dataItemInstance[propertyName].toString() == ''))
					{
						done(_this.restack.messagesHelper.validationRequiredFailed(type, propertyName));
						return;
					}
						
					if (_this.internals.checkType(constraint, dataItemInstance[propertyName]) == false)
					{
						done(_this.restack.messagesHelper.validationTypeFailed(type, propertyName, constraint.type));
						return;
					}
					
				}
			}
			
			done();
		}
		else
			done();
		
	},checkUnique:function(type, propertyName, data, done){//doing away with this, we just set the field in mongo to be unique, will raise an error in data update
		var _this = this;
		
		//now we pull direct from the db
		var criteria = {};
		criteria[propertyName] = data[propertyName];
		 _this.restack.dataHelper.find(type, criteria, function(e, items) { 
				if (!e && items != null)
				{
					done(null, items.length > 0?true:false);
				}
				else
					done(e, true);
		});

	}
}

module.exports = validation_helper;