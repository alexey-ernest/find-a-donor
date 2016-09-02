/**
 * @fileOverview Donors endpoint tests.
 */

var app = require('../../');
var request = require('supertest');
var async = require('async');

var chai = require('chai');
chai.should();
chai.use(require('chai-things'));
var expect = chai.expect;

var SAMPLE_DONOR_DATA = [
  {
    firstName: 'Alexey',
    lastName: 'Melnikov',
    contactNumber: '+79257338444',
    emailAddress: 'aaa@aaa.com',
    bloodGroup: '0-',
    loc: [37.6155600, 55.7522200] // Moscow coordinates
  },
  {
    firstName: 'Evgenia',
    lastName: 'Melnikova',
    contactNumber: '+79257338445',
    emailAddress: 'bbb@bbb.com',
    bloodGroup: '0+',
    loc: [37.2712342, 55.599648] // Vnukovo coordinates
  },
  {
    firstName: 'Maxim',
    lastName: 'Melnikov',
    contactNumber: '+79257338446',
    emailAddress: 'ccc@cc.com',
    bloodGroup: '0+',
    loc: [37.4125029, 55.9736482] // Seremetevo coordinates
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

    it('should not create a donor without firstName', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0]);
      delete donorData['firstName'];

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('firstName');

          done();
        });
    });

    it('should not create a donor with empty firstName', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0], {
        firstName: ' '
      });

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('firstName');

          done();
        });
    });

    it('should not create a donor without lastName', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0]);
      delete donorData['lastName'];

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('lastName');

          done();
        });
    });

    it('should not create a donor with empty lastName', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0], {
        lastName: ' '
      });

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('lastName');

          done();
        });
    });

    it('should not create a donor without contactNumber', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0]);
      delete donorData['contactNumber'];

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('contactNumber');

          done();
        });
    });

    it('should not create a donor with 10-digit invalid contactNumber', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0], {
        contactNumber: '9257338888'
      });

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('contactNumber');

          done();
        });
    });

    it('should not create a donor without emailAddress', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0]);
      delete donorData['emailAddress'];

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('emailAddress');

          done();
        });
    });

    it('should not create a donor with invalid emailAddress', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0], {
        emailAddress: '@aaaa.com'
      });

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('emailAddress');

          done();
        });
    });

    it('should not create a donor without bloodGroup', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0]);
      delete donorData['bloodGroup'];

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('bloodGroup');

          done();
        });
    });

    it('should not create a donor with invalid bloodGroup', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0], {
        bloodGroup: 'C-'
      });

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('bloodGroup');

          done();
        });
    });

    it('should not create a donor with a bloodGroup without Rh', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0], {
        bloodGroup: 'A'
      });

      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);

          res.body.should.have.property('bloodGroup');

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
          donor.loc[0].should.equal(donorData.loc[0]);
          donor.loc[1].should.equal(donorData.loc[1]);

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

  describe('PUT /{id}', function () {
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

    it('should update donor data', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0]);
      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);

          var donor = res.body;
          id = donor._id;

          donorData.firstName += id;

          request(app)
            .put('/api/donors/' + donor._id)
            .send(donorData)
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);

              request(app)
                .get('/api/donors/' + donor._id)
                .expect(200)
                .end(function (err, res) {
                  if (err) return done(err);

                  res.body.firstName.should.equal(donorData.firstName);
                  done();
                });
            });
        });
    });

    it('should not allow update with invalid data', function (done) {
      var donorData = Object.assign({}, SAMPLE_DONOR_DATA[0]);
      request(app)
        .post('/api/donors')
        .send(donorData)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);

          var donor = res.body;
          id = donor._id;

          donorData.bloodGroup += '_';

          request(app)
            .put('/api/donors/' + donor._id)
            .send(donorData)
            .expect(400, done);
        });
    });

  });

  describe('GET /find/:bllng,:bllat/:urlng,:urlat', function () {

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

    it('should find all 3 donors in a specified rectangle', function (done) {

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

        // searching for donors near the center of the Moscow
        var loc = [37.6155600, 55.7522200],
            dist = 0.5,
            bl = [loc[0] - dist, loc[1] - dist],
            ur = [loc[0] + dist, loc[1] + dist];

        request(app)
          .get('/api/donors/find/' + bl[0] + ',' + bl[1] + '/' + ur[0] + ',' + ur[1])
          .expect(200, function (err, res) {
            if (err) return done(err);

            var searchResults = res.body;
            expect(searchResults.length >= 3).to.be.true;

            searchResults.should.contain.a.thing.with.property('_id', donors[0]._id);
            searchResults.should.contain.a.thing.with.property('_id', donors[1]._id);
            searchResults.should.contain.a.thing.with.property('_id', donors[2]._id);

            done();
          });
      });
    });

  });

});
