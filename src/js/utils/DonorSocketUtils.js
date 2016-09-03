/**
 * Utilities for working with socket.
 */

import loadscript from './loadscript';
import DonorActionCreators from '../actions/DonorActionCreators';

var SOCKETS_URL,
    URL;
if (process.env.NODE_ENV === 'production') {
  SOCKETS_URL = '/socket.io/socket.io.js';
  URL = null;
} else {
  SOCKETS_URL = 'http://localhost:8080/socket.io/socket.io.js';
  URL = 'http://localhost:8080/'
}

/**
 * Emits register donor event.
 *
 * @param      {Object}  donorData  The donor data.
 */
function registerDonor(donorData) {
  if (!socket) {
    return;
  }

  socket.emit('registerDonor', donorData);
}

/**
 * Emits findDonors event.
 *
 * @param      {[lng,lat]}  bl      Bottom left corner.
 * @param      {[lng,lat]}  ur      Upper right corner.
 */
function findDonors(bl, ur) {
  // memoization
  var data;
  if (!bl || !ur) {
    data = findDonors.data;
  } else {
    data = {bl: bl, ur: ur};
    findDonors.data = data;
  }

  if (!socket) {
    setTimeout(function () {
      findDonors();
    }, 500);
    return;
  }

  if (!data) {
    // first load and immediate call from socket event
    return;
  }

  socket.emit('findDonors', data);
}

/**
 * Emits update donor event.
 *
 * @param      {Object}  donorData  Updated donor data.
 */
function updateDonor(donorData) {
  if (!socket) {
    return;
  }

  socket.emit('updateDonor', donorData);
}

/**
 * Emits get donor event.
 *
 * @param      {string}  id      Donor id.
 */
function getDonor(id) {
  if (!socket) {
    setTimeout(function () {
      getDonor(id);
    }, 500);
    return;
  }

  socket.emit('getDonor', id);
}

/**
 * Emits delete donor event.
 *
 * @param      {string}  id      Donor id.
 */
function deleteDonor(id) {
  if (!socket) {
    return;
  }

  socket.emit('deleteDonor', id);
}

/**
 * Registers socket event handlers.
 */
function registerHandlers() {
  socket.on('newDonor', function (donor) {
    // donor registered
    DonorActionCreators.receiveNewDonor(donor);
  });

  socket.on('donors', function (donors) {
    // visible donors
    DonorActionCreators.receiveDonors(donors);
  });

  socket.on('donor', function (donor) {
    // requested donor data arrived
    DonorActionCreators.receiveDonor(donor);
  });

  socket.on('donorUpdated', function (donor) {
    // current donor data has been updated
    DonorActionCreators.receiveDonor(donor);
  });

  socket.on('donorDeleted', function () {
    // current donor was deleted
    DonorActionCreators.receiveDonor();
  });

  socket.on('donorsUpdate', function () {
    // some donor data was updated
    findDonors();
  });
}

// init socket.io
var socket;
loadscript(SOCKETS_URL, function () {
  socket = io(URL);

  // register socket event handlers
  registerHandlers();
});


export default {

  /**
   * Registers new donor.
   *
   * @param      {Object}  donorData  The donor data.
   */
  registerDonor: registerDonor,

  /**
   * Finds donors in rectangular area defined by bottom-left and upper-right corners.
   *
   * @param      {[Number]}  bl      Bottom left corner coordinates.
   * @param      {[Number]}  ur      Upper right corner coordinates.
   */
  findDonors: findDonors,

  /**
   * Update donor.
   *
   * @param      {Object}  donorData  The new donor data.
   */
  updateDonor: updateDonor,

/**
  * Get donor by id.
  *
  * @param      {string}  id      Donor id.
  */
  getDonor: getDonor,

  /**
   * Delete donor.
   *
   * @param      {string}  id  Donor id.
   */
  deleteDonor: deleteDonor

 };
