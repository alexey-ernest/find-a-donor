
/**
 * @fileOverview Donors endpoints.
 */

var express = require('express');
var router = express.Router();

var db = require('../../../db');
var addDonor = require('./add-donor')(db);
var getDonor = require('./get-donor')(db);
var updateDonor = require('./update-donor')(db);
var deleteDonor = require('./delete-donor')(db);
var findDonors = require('./find-donors')(db);

/**
 * Add a donor endpoint.
 */
router.post('/',
  addDonor
  );

/**
 * Get a donor by id.
 */
router.get('/:id',
  getDonor
  );

/**
 * Update donor info.
 */
router.put('/:id',
  updateDonor
  );

/**
 * Delete a donor by id.
 */
router.delete('/:id',
  deleteDonor
  );

/**
 * Find donors endpoint.
 */
router.get('/find/:bllng,:bllat/:urlng,:urlat',
  findDonors
  );

module.exports = router;
