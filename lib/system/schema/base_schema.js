module.exports = {
	modelsCache:{},
	model:{
		Account:{
			constraints:{
				name: {type: "String", index: true, required: true},
				status: {type:"String", 'default': 'accountstatus'},
				description: {type: "String"}
			},
			directives:{
				cache:'static',
				history:'audit'
			}
		},
		User:{
			constraints:{
				emailaddress: {type: "String", index: true, required: true},
				password: {type: "String"},
				firstname: {type: "String"},
				lastname: {type: "String"}
			},
			directives:{
				history:'audit'
			}
	    },
	    Role:{
	    	constraints:{
	    		name: {type: "String", index: true, required: true}
	    	},
			directives:{
				cache:'static',
				history:'audit'
			}
	    },
	    Permission:{
	    	constraints:{
	    		roleId:{type: "Id"},
	    		objectType: {type: "String"},
	    		priviledge: {type: 'Number'}
	    	},
			directives:{
				cache:'static',
				history:'audit'
			}
	    },
	    UserRole:{
	    	constraints:{
	    		userId:{type: "Id"},
	    		roleId:{type: "Id"}
	    	},
			directives:{
				history:'audit'
			}
	    },
	    Archive:{
	    	constraints:{
	    		auditId:{type: "Id"},
	    		archive: {type: "String"}
	    	},
			directives:{
			}
	    },
	    Audit:{
	    	constraints:{
	    		sessionId: {type: "Id"},
	    		systemVersion: {type: 'Number'},
	    		objectType: {type: "String"},
	    		objectId:{type: "Id"},
	    		tag:{type: "String"}
	    	},
			directives:{
			}
	    },
	    Session:{
	    	constraints:{
	    		timestamp:{type:"Date", 'default':'now'},
	    		userId:{type: "String"},
				accountId: {type: "String"}
	    	},
			directives:{
				cache:'lru',
				cacheTTL:'2 hours'
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
    	model['owner'] = {type:'Id'};
    	model['lastUpdatedBy'] = {type:'Id'};
    	model['created'] = {type:'Date', 'default':'now'};
    	model['deleted'] = {type:'Boolean', 'default':false};
    	model['id'] = {type:'Id'};
    	
    	if (type != 'Account')
    		model['accountId'] = {type:'Id'};
    }
}
