/**
 * @fileOverview Donors endpoint tests.
 */

var app = require('../../');
var request = require('supertest');
var async = require('async');

var chai = require('chai');
chai.should();
var expect = chai.expect;

var SAMPLE_DONOR_DATA = [
  {
    firstName: 'Alexey',
    lastName: 'Melnikov',
    contactNumber: 'XXX',
    emailAddress: 'aaa@aaa.com',
    bloodGroup: '0-',
    loc: { // Moscow coordinates
      longitude: 37.6155600,
      latitude: 55.7522200
    }
  },
  {
    firstName: 'Evgenia',
    lastName: 'Melnikova',
    contactNumber: 'XXX',
    emailAddress: 'bbb@bbb.com',
    bloodGroup: '0+',
    loc: { // Vnukovo coordinates
      longitude: 37.2712342,
      latitude: 55.599648
    }
  },
  {
    firstName: 'Maxim',
    lastName: 'Melnikov',
    contactNumber: 'XXX',
    emailAddress: 'ccc@cc.com',
    bloodGroup: '0+',
    loc: { // Seremetevo coordinates
      longitude: 37.4125029,
      latitude: 55.9736482
    }
  }
];

/**
 * Deletes a donor by id.
 *
 * @param      {string}    id      The identifier
 * @param      {Function}  fn      Callback.
 */
function deleteDonor(id, fn) {
  request(app)
    .delete('/api/donors/' + id)
    .expect(200, fn);
};

describe('/api/donors', function () {

  describe('POST /', function () {
    var id;

    afterEach(function(done) {
      // delete each created donor
      if (!id) {
        return done();
      }
      deleteDonor(id, function (err) {
        if (err) return done(err);
          id = null;
          done();
      });
    });

    it('should create a new donor with all the required fields', function (done) {
      var donorData = SAMPLE_DONOR_DATA[0];

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);

          var donor = res.body;

          donor.should.have.property('_id');
          expect(donor._id).not.to.be.null;
          id = donor._id;

          donor.should.have.property('firstName');
          donor.firstName.should.equal(donorData.firstName);

          donor.should.have.property('lastName');
          donor.lastName.should.equal(donorData.lastName);

          donor.should.have.property('contactNumber');
          donor.contactNumber.should.equal(donorData.contactNumber);

          donor.should.have.property('emailAddress');
          donor.emailAddress.should.equal(donorData.emailAddress);

          donor.should.have.property('bloodGroup');
          donor.bloodGroup.should.equal(donorData.bloodGroup);

          donor.should.have.property('loc');
          donor.loc[0].should.equal(donorData.loc.longitude);
          donor.loc[1].should.equal(donorData.loc.latitude);

          done();
        });
    });

  });

  describe('GET /{id}', function () {
    var id;

    afterEach(function(done) {
      // delete each created donor
      if (!id) {
        return done();
      }
      deleteDonor(id, function (err) {
        if (err) return done(err);
        id = null;
        done();
      });
    });

    it('should return 404 for inexistent donor id', function (done) {
      request(app)
        .get('/api/donors/507f191e810c19729de860ea')
        .expect(404, done);
    });

    it('should return a correct data for the donor by id', function (done) {
      request(app)
        .post('/api/donors')
        .send(SAMPLE_DONOR_DATA[0])
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);

          var donor = res.body;
          id = donor._id;

          request(app)
            .get('/api/donors/' + donor._id)
            .expect(donor, done);
        });
    });

  });

  describe('GET /find/:longitude/:latitude/:distance', function () {

    var donors = [];

    afterEach(function(done) {
      if (!donors.length) {
        return done();
      }

      function deleteDonorTask(id) {
        return function (cb) {
          deleteDonor(id, cb);
        }
      }

      var tasks = donors.map(function (d) {
        return deleteDonorTask(d._id);
      });

      async.parallel(tasks, function (err) {
        if (err) return done(err);
        donors = [];
        done();
      });
    });

    it('should find 3 donors in a specified radius', function (done) {
      this.timeout(10 * 1000);

      // creating donors
      function createDonorTask(data) {
        return function (cb) {
          request(app)
            .post('/api/donors')
            .send(data)
            .expect(200)
            .end(function (err, res) {
              if (err) return cb(err);
              cb(null, res.body);
            });
        }
      }

      var data = SAMPLE_DONOR_DATA
          len = data.length,
          tasks = [];
      for (var i = 0; i < len; i+=1) {
        tasks[i] = createDonorTask(data[i]);
      }

      async.series(tasks, function (err, donorsData) {
        if (err) return done(err);
        donors = donorsData;

        // searching for donors 30km near the center of the Moscow
        request(app)
          .get('/api/donors/find/37.6155600/55.7522200/30000')
          .expect(200, function (err, res) {
            if (err) return done(err);

            var searchResults = res.body;
            searchResults.length.should.equal(3);
            done();
          });
      });
    });

  });

});
