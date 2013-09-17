restack = require('../lib/restack');
restack.initialize({}, function(err){
	
	/*
	var users = [{
	    emailaddress: 'test@example.com',
	    password: 'multiples',
	    firstname: 'name',
	    lastname: 'surname'
	},{
	    emailaddress: 'test@example.com',
	    password: 'multiples',
	    firstname: 'name',
	    lastname: 'surname'
	}];

	console.log('create many happening');

	var result = restack.dataPlugin.create('User', users, function(err, newObj) {

	  
	    console.log('many results');
	    console.log(newObj);
	    
	    
	    
	});
	*/
	var user = {
	    emailaddress: 'test@example.com',
	    password: 'multiples',
	    firstname: 'name',
	    lastname: 'surname'
	}
	
	var result = restack.dataPlugin.create('User', user, function(err, newObj) {

		  
	    console.log('single result');
	    console.log(newObj);
	    
	    /*
	    Not yet - we arent using the schema yet
	    expect(newObj).to.have.property('id');
	    expect(newObj).to.have.property('owner');
	    expect(newObj).to.have.property('lastUpdatedBy');
	    expect(newObj).to.have.property('created');
	    expect(newObj).to.have.property('deleted');
	    expect(newObj).to.have.property('accountId');
	    */
	    
	});
	
});


    
   
