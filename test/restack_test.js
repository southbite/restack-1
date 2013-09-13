restack = require('../lib/restack');
var plugins_test = require('./plugins_test');
var server_test = require('./server_test');
var async = require('async');

restack.initialize({settings:require('./restack_test_settings')}, function(e){
	
	if (!e)
	{
		console.log('running plugins tests');
		async.series([
		              plugins_test.test_cache,
		              plugins_test.test_session,
		              plugins_test.test_data,
		              plugins_test.test_auth
		          ],
		          function(err, results){
		             for (var resIndex in results)
		            	 console.log(results[resIndex]);
		          });
		
		
		restack.start(function(e){
			if (e)
				console.log('restack failed to start: ' + e);
			else
			{
				console.log('restack started successfully');
				
				async.series([
				              server_test.testCreateAccount,
				              server_test.testLogin,
				              server_test.testCreateData,
				              server_test.testGetData,
				              server_test.testFindData,
				              server_test.testUpdateData,
				              server_test.testDeleteData,
				              server_test.testCreateGuest,
				              server_test.testGuestInsufficientPriviledges,
				              server_test.testGetPermissions
				          ],
				          function(err, results){
				             for (var resIndex in results)
				            	 console.log(results[resIndex]);
				          });
				
				
			}
				
		});
	}
	else
		console.log('restack failed to initialize: ' + e);
	
});
