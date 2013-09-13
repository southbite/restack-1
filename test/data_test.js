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

});
