module.exports = {
	modelsCache:{},
	model:{
		Account:{
			name: {type: "String", index: true, required: true},
			status: {type:"String", 'default': 'accountstatus'},
			description: {type: "String"}
		},
		User:{
			emailaddress: {type: "String", index: true, required: true},
			password: {type: "String"},
			firstname: {type: "String"},
			lastname: {type: "String"}
	    },
	    Role:{
	        name: {type: "String", index: true, required: true}
	    },
	    Permission:{
	    	roleID:{type: "ID"},
	    	objectType: {type: "String"},
	    	priviledge: {type: 'Number'}
	    },
	    UserRole:{
	    	userID:{type: "ID"},
	    	roleID:{type: "ID"}
	    },
	    Archive:{
	    	auditID:{type: "ID"},
	    	archive: {type: "String"}
	    },
	    Audit:{
	    	sessionID: {type: "ID"},
	    	systemVersion: {type: 'Number'},
	    	objectType: {type: "String"},
	    	objectId:{type: "ID"},
	    	tag:{type: "String"}
	    },
	    Session:{
	    	timestamp:{type:"Date", 'default':'now'},
	    	userId:{type: "String"},
			accountId: {type: "String"}
	    }
    },
    directives:{
    	cache:{'Session':'lru','Role':'static', 'Account':'static','Permission':'static'},
		history:{'UserRole':'audit','UserRole':'audit'}
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
        		}
        	}
    		
    		for (var modelItemKey in externalSchema.directives.cache)
        	{
    			if (this.model[modelItemKey] != null)
        		{
        			done('System model name used in custom schema cache directive: ' + modelItemKey);
        		}
        	}
    		
    		for (var modelItemKey in externalSchema.directives.history)
        	{
    			if (this.model[modelItemKey] != null)
        		{
        			done('System model name used in custom schema history directive: ' + modelItemKey);
        		}
        	}
    		
    		this.model[modelItemKey] = externalSchema.model[modelItemKey];
    		this.directives.cache[modelItemKey] = externalSchema.directives.cache[modelItemKey];
    		this.directives.history[modelItemKey] = externalSchema.directives.history[modelItemKey];
    		
    		done();
    	}
    	catch(e)
    	{
    		done(e);
    	}
    },
    getModel:function(type, done)
    {
    	if (this.modelsCache[type] != null)
    		done(null,this.modelsCache[type]);
    	else if (this.model[type] != null)
    	{
    		this.addSystemFields(type, this.model[type], function(preparedModel){
    			this.modelsCache[type] = preparedModel;
    			done(null, preparedModel);
    		});
    	}
    	else
    		done('Model for type: ' + type + ' not found');
    },
    addSystemFields:function(type, model, done)
    {
    	model['owner'] = {type:'ID'};
    	model['lastUpdatedBy'] = {type:'ID'};
    	model['created'] = {type:'Date', 'default':'now'};
    	model['deleted'] = {type:'Boolean', 'default':false};
    	model['ID'] = {type:'ID'};
    	
    	if (type != 'Account')
    		model['accountID'] = {type:'ID'};
    }
}