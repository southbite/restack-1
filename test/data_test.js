restack = require('../lib/restack');

var expect = require('expect.js');

describe('data-tests', function() {

    before(function(callback) {
        restack.initialize({}, callback);
    });

    var createdId = null;
    
    describe('test-create', function() {

        it('should create object of User', function(callback) {

            var user = {
                emailaddress: 'test@example.com',
                password: 'whatevs',
                firstname: 'name',
                lastname: 'surname'
            };

            var result = restack.dataPlugin.create('User', user, function(err, newObj) {

                expect(err).to.be(null);

                expect(newObj[0]).to.be.ok();
                expect(newObj[0].emailaddress).to.be('test@example.com');
                expect(newObj[0].password).to.be('whatevs');
                expect(newObj[0].firstname).to.be('name');
                expect(newObj[0].lastname).to.be('surname');

                createdId = newObj[0].id;
                
                /*
                Not yet - we arent using the schema yet
                expect(newObj).to.have.property('id');
                expect(newObj).to.have.property('owner');
                expect(newObj).to.have.property('lastUpdatedBy');
                expect(newObj).to.have.property('created');
                expect(newObj).to.have.property('deleted');
                expect(newObj).to.have.property('accountId');
                 */
                
                callback();
            });

        });

    });

    describe('test-create-many', function() {

        it('should create 2 object of User', function(callback) {

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

                expect(err).to.be(null);

                expect(newObj.length).to.be(2);

                console.log('many results');
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
                
                callback();
            });

            expect(result).to.be(undefined);
        });

    });
    /*
    describe('test-getAll', function() {

        it('should find all objects of User', function (callback) {

        	restack.dataPlugin.find('User', {}, function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data.length > 0).to.be(true);
        		
        		console.log('found many ' + data.length);
        		
        		callback();
        	});
        });
    });
    
    
    describe('test-getByID', function() {

        it('should findOne object of User by ID', function (callback) {

        	restack.dataPlugin.find('User', {id:createdId}, function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data.length == 1).to.be(true);
        		
        		callback();
        	});
        });
    });

    describe('test-find', function() {

        it('should find objects of User by firstname', function (callback) {

        	restack.dataPlugin.find('User', {firstname:'name'}, function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data.length > 0).to.be(true);
        		
        		callback();
        	});
        });
    });

    describe('test-not find', function() {

        it('should find no objects of User by firstname unknown', function (callback) {

        	restack.dataPlugin.find('User', {firstname:'unknown'}, function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data.length == 0).to.be(true);
        		
        		callback();
        	});
        });
    });
  
    describe('test-getAll', function() {

        it('should find all objects of User', function (callback) {

        	restack.dataPlugin.find('User', {}, function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data.length > 0).to.be(true);
        		
        		callback();
        	});
        });
    });

    */
    
    describe('test-update', function() {

        it('should update all objects of User with lastname surname to lastname = updated', function (callback) {

        	restack.dataPlugin.update('User', {lastname:'surname'}, {lastname:'updated'}, null, function(err, data){
        		expect(err).to.be(null);
        		
        		console.log(data);
        		
        		expect(data).to.be.ok();
        		expect(data > 0).to.be(true);
        		
        		callback();
        	});
        });
    });

    /*
    describe('test-softdelete', function() {

        it('should soft delete all objects of User with emailaddress test@example.com', function (callback) {

        	restack.dataPlugin.remove('User', {emailaddress:'test@example.com'}, null, function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data > 0).to.be(true);
        		
        		console.log('soft deleted');
        		console.log(data);
        		
        		callback();
        	});
        });
    });
    
    describe('test-harddelete', function() {

        it('should hard delete all objects of User with emailaddress test@example.com', function (callback) {

        	restack.dataPlugin.remove('User', {emailaddress:'test@example.com'}, {hard:true}, function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data > 0).to.be(true);
        		
        		console.log('hard deleted');
        		console.log(data);
        		
        		callback();
        	});
        });
    });
    */

});
