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

function findDonors (bl, ur) {
  if (!socket) {
    return;
  }

  // memoization
  var data;
  if (!bl || !ur) {
    data = findDonors.data;
  } else {
    data = {bl: bl, ur: ur};
    findDonors.data = data;
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

export default {

  /**
   * Registers new donor.
   *
   * @param      {Object}  donorData  The donor data.
   */
  registerDonor: function (donorData) {
    if (!socket) {
      return;
    }

    socket.emit('registerDonor', donorData);
    socket.on('newDonor', function (donor) {
      DonorActionCreators.receiveNewDonor(donor);
    });
  },

  /**
   * Finds donors in rectangular area defined by bottom-left and upper-right corners.
   *
   * @param      {[Number]}  bl      Bottom left corner coordinates.
   * @param      {[Number]}  ur      Upper right corner coordinates.
   */
  findDonors: function (bl, ur) {
    if (!socket) {
      return;
    }

    socket.emit('findDonors', {bl: bl, ur: ur});
    socket.on('donors', function (donors) {
      DonorActionCreators.receiveDonors(donors);
    });

    // listening for donors updates
    socket.on('donorsUpdate', function () {

    });
  }

 };
