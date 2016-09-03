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

// init socket.io
var socket;
loadscript(SOCKETS_URL, function () {
  socket = io(URL);
});


function registerDonor (donorData) {
  if (!socket) {
    return;
  }

  socket.emit('registerDonor', donorData);
  socket.on('newDonor', function (donor) {
    DonorActionCreators.receiveNewDonor(donor);
  });
}

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

  socket.emit('findDonors', data);
  socket.on('donors', function (donors) {
    DonorActionCreators.receiveDonors(donors);
  });

  // listening for donors updates
  socket.on('donorsUpdate', function () {
    findDonors();
  });
}

function updateDonor(donorData) {
  if (!socket) {
    return;
  }

  socket.emit('updateDonor', donorData);
  socket.on('donorUpdated', function (donor) {
    DonorActionCreators.receiveDonor(donor);
  });
}

function getDonor(id) {
  if (!socket) {
    setTimeout(function () {
      getDonor(id);
    }, 500);
    return;
  }

  socket.emit('getDonor', id);
  socket.on('donor', function (donor) {
    DonorActionCreators.receiveDonor(donor);
  });
}

function deleteDonor(id) {
  if (!socket) {
    return;
  }

  socket.emit('deleteDonor', id);
  socket.on('donorDeleted', function () {
    DonorActionCreators.receiveDonor();
  });
}

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
