restack = require('../lib/restack');

var expect = require('expect.js');

describe('data-tests', function() {

  afterEach(function(callback) {
    restack.dataPlugin.internals.db.dropDatabase(callback);
  });


  before(function(callback) {
        restack.initialize({}, callback);
    });

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

      var beforeUser=null;

      before(function(callback) {
        var user = {
          emailaddress: 'test@example.com',
          password: 'whatevs',
          firstname: 'name',
          lastname: 'surname'
        };

        restack.dataPlugin.create('User', user, function(err, newObj) {
          beforeUser = newObj;
          callback(err);
        });
      });

      it('should find object of type User', function(callback) {
        restack.dataPlugin.findOne('User', {id: beforeUser.id}, function(err, found) {
          expect(found).to.be.ok();
          expect(found.emailaddress).to.be('test@example.com');
          expect(found.password).to.be('whatevs');
          expect(found.firstname).to.be('name');
          expect(found.lastname).to.be('surname');
          callback(err);
        });
      });
    });

  describe('test-findAll', function() {

    var beforeUsers=[];

    before(function(callback) {
      var users = [{
        emailaddress: 'test@example.com',
        password: 'whatevs',
        firstname: 'name',
        lastname: 'surname'
      }, {
        emailaddress: 'test2@example.com',
        password: 'whatevs2',
        firstname: 'name2',
        lastname: 'surname2'
      }];
      ;
      restack.dataPlugin.internals.db.collection('User').insert(users, function(err, newUsers) {
        beforeUsers = newUsers;
        callback(err);
      });
    });

    it('should find two objects of type User', function(callback) {
      restack.dataPlugin.find('User', {}, function(err, found) {
        expect(err).to.be(null);
        expect(found.length).to.be(2);
        callback(err);
      });
    });
  });

});
