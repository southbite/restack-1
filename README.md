restack
=======

Restful JSON API built on top of Node and Express, with built-in ORM, account management and caching

To run the tests, download the project, in the root folder of the project run: node test/restack_test

To run the restack server, create a file and execute using node:

```
	restack = require('./lib/restack');
	
	restack.initialize({}, function(e){
	  
		if (!e)
		{
			restack.start(function(e){
				if (e)
					console.log('restack failed to start: ' + e);
				else
					console.log('restack started successfully');
			});
		}
		else
			console.log('restack failed to initialize: ' + e);
		
	});
```



