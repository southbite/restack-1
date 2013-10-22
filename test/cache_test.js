restack = require('../lib/restack');

var expect = require('expect.js');

describe('cache-tests', function() {
	
	before(function(callback) {
        restack.initialize({}, callback);
    });
	
	 var cachedObjects
	
	describe('test-cache-many', function() {

        it('caches multiple objects', function(callback) {

            cachedObjects = [{
                key: '2',
                password: 'whatevs',
                firstname: 'name',
                lastname: 'surname'
            },
            {
            	 key: '1',
                 password: 'whatevs',
                 firstname: 'name',
                 lastname: 'surname'
            }];

            var result = restack.cachePlugin.updateAll({data:cachedObjects, keyName:'key', collection:'CacheTest', ttl:0}, function(e, count) {

                expect(e).to.be(null);
                expect(count > 0).to.be(true);
                
                callback();
            });

        });

    });
	 
	describe('test-cache-single', function() {

	        it('caches single object', function(callback) {

	            cachedObject = {
	                key: '3',
	                password: 'whatevs',
	                firstname: 'name',
	                lastname: 'surname'
	            }

	            var result = restack.cachePlugin.update({data:cachedObject, key:'3', collection:'CacheTest', ttl:0}, function(e, response) {

	                expect(e).to.be(null);
	                expect(response).to.be('OK');
	                
	                callback();
	            });

	        });

	    });
	
	describe('test-cache-get-single', function() {

        it('gets a single item from cache', function(callback) {

        	 restack.cachePlugin.find({collection:'CacheTest', ttl:0, key:'3'}, function(e, response) {

        		 console.log(response);
        		 
                 expect(e).to.be(null);
                 expect(response.key).to.be('3');
                 
                 callback();
             });

        });

    });
	
	describe('test-cache-get-single-none-existent', function() {

        it('gets all for collection from cache', function(callback) {

        	 restack.cachePlugin.find({collection:'CacheTest', ttl:0, key:'0'}, function(e, response) {

        		 console.log(response);
        		 
                 expect(e).to.be(null);
                 expect(response).to.be(null);
                 
                 callback();
             });

        });

    });
	
	describe('test-cache-get-multiple', function() {

        it('gets all for collection from cache', function(callback) {

        	 var result = restack.cachePlugin.findAll({collection:'CacheTest', ttl:0}, function(e, response) {

        		 console.log(response);
        		 
                 expect(e).to.be(null);
                 expect(response.length).to.be(3);
                 
                 callback();
             });

        });

    });
	
	describe('test-cache-get-multiple-non-existent', function() {

        it('gets all for a non existent collection from cache', function(callback) {

        	 var result = restack.cachePlugin.findAll({collection:'NonExistent', ttl:0}, function(e, response) {

        		 console.log(response);
        		 
                 expect(e).to.be(null);
                 expect(response.length).to.be(0);
                 
                 callback();
             });

        });

    });
	
	describe('test-cache-clear-single', function() {

        it('clears a single item from cache', function(callback) {

        	 var result = restack.cachePlugin.clear({collection:'CacheTest', key:'3'}, function(e, response) {

        		 console.log(response);
        		 
                 expect(e).to.be(null);
                 expect(response).to.be('OK');
                 
                 restack.cachePlugin.findAll({collection:'CacheTest', ttl:0}, function(e, response) {

            		 console.log(response);
            		 
                     expect(e).to.be(null);
                     expect(response.length).to.be(2);
                     
                     callback();
                 });
                 
             });

        });

    });
	
	describe('test-cache-clear-all', function() {

        it('clears all items from cache', function(callback) {

        	 var result = restack.cachePlugin.clearAll({collection:'CacheTest'}, function(e, response) {

        		 console.log(response);
        		 
                 expect(e).to.be(null);
                 expect(response).to.be(2);
                 
                 restack.cachePlugin.findAll({collection:'CacheTest', ttl:0}, function(e, response) {

            		 console.log(response);
            		 
                     expect(e).to.be(null);
                     expect(response.length).to.be(0);
                     
                     callback();
                 });
                 
             });

        });

    });
	
	describe('test-cache-clear-single-nonexistent', function() {

        it('clears a single item from cache', function(callback) {

        	 var result = restack.cachePlugin.clear({collection:'NoneExistent', key:'0'}, function(e, response) {

        		 console.log(response);
        		 
                 expect(e).to.be(null);
                 expect(response).to.be('OK');
                 
                 callback();
             });

        });

    });
	
	describe('test-cache-clear-all-nonexistent', function() {

        it('clears all items from cache', function(callback) {

        	 var result = restack.cachePlugin.clearAll({collection:'NoneExistent'}, function(e, response) {

        		 console.log(response);
        		 
                 expect(e).to.be(null);
                 expect(response).to.be(0);
                 
                 callback();
             });

        });

    });
	
});