
/**
 * @fileOverview Donors endpoints.
 */

var express = require('express');
var router = express.Router();

var addDonor = require('./add-donor');
var findDonors = require('./find-donors');

/**
 * Add a donor endpoint.
 */
router.post('/',
  addDonor
  );

/**
 * Find donors endpoint.
 */
router.get('/:longitude/:latitude/:distance?',
  findDonors
  );

module.exports = router;
