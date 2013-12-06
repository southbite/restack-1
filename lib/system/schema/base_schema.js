module.exports = {
	modelsCache:{},
	model:{
		Account:{
			constraints:{
				name: {type: "String", index: true, required: true},
				description: {type: "String"}
			},
			directives:{
				cache:'static',
				history:'audit',
				checkVersionConcurrency:true
			}
		},
	    Role:{
	    	constraints:{
	    		name: {type: "String", required: true},
	    		permissions:{type: "Permission", min:0, max:0}
	    	},
			directives:{
				cache:'static',
				history:'audit',
				checkVersionConcurrency:true
			}
	    },
	    Permission:{
	    	method:{type: "String", required:true},
	    	types:{type: "String", min:0, max:0}
	    },
		User:{
			constraints:{
				emailaddress: {type: "String", index: true, required: true},
				username: {type: "String", index: true, required: true, unique:true},
				secret: {type: "String"},
				names: {type: "String"},
				status: {type:"String", 'default': 'Unconfirmed'}
			},
			directives:{
				history:'audit',
				checkVersionConcurrency:true,
				cacheTTLMinutes:120
			}
	    },
	    Login:{
	    	username: {type: "String", index: true, required: true},
	    	token:{type:"String", persist:false}
	    },
	    UserAccount:{
			constraints:{
				userId:{type: "Id", index: true, required: true},
	    		accountId:{type: "Id", index: true, required: true},
	    		role:{type: "String", required: true}
			},
			directives:{
				history:'audit',
				checkVersionConcurrency:true,
				cacheTTLMinutes:120
			}
	    },
	    Dynamic:{
	    	constraints:{
	    		
	    	},
			directives:{
				cacheTTLMinutes:120
			}
	    }
    },
    addExternal:function(externalSchema, done)
    {
    	try
    	{
    		for (var modelItemKey in externalSchema.model)
        	{
        		if (this.model[modelItemKey] != null)
        		{
        			done('System model name used in custom schema: ' + modelItemKey);
        			return;
        		}
				else
					this.model[modelItemKey] = externalSchema.model[modelItemKey];
        	}
    		
    		done();
    	}
    	catch(e)
    	{
    		done(e);
    	}
    },
    getModel:function(type, previous)
    {
    	if (this.modelsCache[type] != null)
    		return this.modelsCache[type];
    	else if (this.model[type] != null)
    	{
    		var preparedModel = this.addSystemFields(type, this.model[type]);
    		this.modelsCache[type] = preparedModel;
    		return preparedModel;
    	}
    	else if (type != 'Dynamic')
    		return this.getModel('Dynamic', type);
    	else
    		throw "Model for type " + type + " not found, dynamic types not supported";
    },
    addSystemFields:function(type, model)
    {
    	model['owner'] = {type:'Id'};
    	model['lastUpdatedBy'] = {type:'Id'};
    	model['created'] = {type:'Date', 'default':'now'};
    	model['deleted'] = {type:'Boolean', 'default':false};
    	model['id'] = {type:'Id'};
    	
    	if (type != 'Account')
    		model['accountId'] = {type:'Id'};
    	
    	return model;
    }
}
