restack = require('./lib/restack');

restack.initialize({}, function(e){
	
	if (!e)
		console.log('restack initialized OK');
	else
		console.log('restack initialize failed: ' + e);
	
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
