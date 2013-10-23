restack = require('./lib/restack');

restack.initialize({}, function(e){
	
	console.log('restack initialized: ' + e);
	
	if (!e)
	{
		restack.start(function(e){
			if (e)
				console.log('restack failed to start: ' + e);
			else
				console.log('restack started successfully');
		});
	}
	else{
		console.log('restack failed to initialize: ' + e);
	}
	
});
