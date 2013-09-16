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

                expect(newObj).to.be.ok();
                expect(newObj.emailaddress).to.be('test@example.com');
                expect(newObj.password).to.be('whatevs');
                expect(newObj.firstname).to.be('name');
                expect(newObj.lastname).to.be('surname');

                createdId = newObj.id;
                
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

    describe('test-findOne', function() {

        it('should findOne object of User', function (callback) {

        	restack.dataPlugin.findOne('User', {emailaddress:'test@example.com'}, function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data.password).to.be('whatevs');
        		
        		callback();
        	});
        });
    });
    
    describe('test-getByID', function() {

        it('should findOne object of User by ID', function (callback) {

        	restack.dataPlugin.getById('User', createdId, function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data.password).to.be('whatevs');
        		
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

        	restack.dataPlugin.getAll('User', function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data.length > 0).to.be(true);
        		
        		callback();
        	});
        });
    });
    
    describe('test-update', function() {

        it('should update all objects of User with lastname surname to lastname = updated', function (callback) {

        	restack.dataPlugin.update_criteria('User', {lastname:'surname'}, {lastname:'updated'}, null, function(err, data){
        		expect(err).to.be(null);
        		
        		expect(data).to.be.ok();
        		expect(data > 0).to.be(true);
        		
        		callback();
        	});
        });
    });

});
