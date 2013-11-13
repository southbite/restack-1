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
			
		},
		checkUnique:function(type, propertyName, data, done){
			var _this = this;
			
			//first check the cache, of there is an id here
			if (data.id != null)
				_this.restack.dataCacheHelper.find(type, {id:data.id}, function(e, items){
					if (!e)
					{
						if (items[0][propertyName] == data[propertyName])
							done(null, false);
						else
							done(null, true);
					}
					else
						done(e);
				});
			else
			{
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
	},
	initialize:function(params, done)
	{
		done();
	},
	validateRequest:function(type, data, done){
		
		this.restack.log("Validation plugin running");
		console.log(data);
		var validationResult = {valid:true, checks:[]};
		var model = this.restack.schema.model[type];
		var dataArray = [];
		
		if (!Array.isArray(data))
			dataArray.push(data);//turn it into an array so we dont repeat ourselves
		else
			dataArray = data;
		
		if (model != null)
		{
			//NEED TO USE ASYNC FOR THIS
			for (var dataItemIndex in dataArray)
			{
				var dataItemInstance = dataArray[dataItemIndex];
				var currentCheck = {};
				
				for (var propertyName in model.constraints)
				{
					this.restack.log(dataItemIndex);
					this.restack.log('dataItemInstance');
					console.log(dataItemInstance);
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
					
					
					/*
					if (constraint.unique == true && this.internals.checkUnique(propertyName, dataItemInstance[propertyName]))
					{
						validationResult.valid = false;
						currentCheck[propertyName] = "Unique constraint violated for property: " + propertyName;
					}
					*/
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