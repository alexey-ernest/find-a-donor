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

export default {

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
  }

 };
