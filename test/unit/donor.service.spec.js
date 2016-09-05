/**
 * @fileOverview Donors service tests.
 */

var donorService = require('../../lib/services/donor.service');

var sinon = require('sinon');
var chai = require('chai');
chai.should();
var expect = chai.expect;

var SAMPLE_DONOR = {
  firstName: 'Alexey',
  lastName: 'Melnikov',
  contactNumber: '+79257338444',
  emailAddress: 'aaa@aaa.com',
  bloodGroup: '0-',
  loc: [37.6155600, 55.7522200] // Moscow coordinates
};

describe('Donor Service', function () {

  describe('#registerDonor()', function () {

    it('should be a function', function() {
      var service = donorService({});

      service.should.have.property('registerDonor');
      service.registerDonor.should.be.a('function');
    });

    it('should not create a donor without firstName', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      delete data.firstName;
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('firstName');

        done();
      })
    });

    it('should not create a donor with empty firstName', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      data.firstName = ' ';
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('firstName');

        done();
      })
    });

    it('should not create a donor without lastName', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      delete data.lastName;
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('lastName');

        done();
      })
    });

    it('should not create a donor with empty lastName', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      data.lastName = ' ';
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('lastName');

        done();
      })
    });

    it('should not create a donor without contactNumber', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      delete data.contactNumber;
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('contactNumber');

        done();
      })
    });

    it('should not create a donor with 10-digit invalid contactNumber', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      data.contactNumber = '9257338888';
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('contactNumber');

        done();
      })
    });

    it('should not create a donor without emailAddress', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      delete data.emailAddress;
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('emailAddress');

        done();
      })
    });

    it('should not create a donor with invalid emailAddress', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      data.emailAddress = '@aaaa.com';
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('emailAddress');

        done();
      })
    });

    it('should not create a donor without bloodGroup', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      delete data.bloodGroup;
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('bloodGroup');

        done();
      })
    });

    it('should not create a donor with invalid bloodGroup', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      data.bloodGroup = 'C-';
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('bloodGroup');

        done();
      })
    });

    it('should not create a donor with a bloodGroup without Rh', function (done) {
      var service = donorService({});

      var data = Object.assign({}, SAMPLE_DONOR);
      data.bloodGroup = 'A';
      service.registerDonor(data, function (err) {

        err.should.have.property('errors');
        var errors = err.errors;

        errors.should.have.property('bloodGroup');

        done();
      })
    });

    it('should create a donor with all the required fields', function () {
      var spy = sinon.spy();
      var db = {
        Donor: {
          create: spy
        }
      }

      var service = donorService(db);
      var data = Object.assign({}, SAMPLE_DONOR);

      service.registerDonor(data);

      spy.callCount.should.equal(1);
    });

  });

});
