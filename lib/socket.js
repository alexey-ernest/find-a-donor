/**
 * Socket interface data updates.
 */

var debug = require('debug')('find-a-donor:socket');
var bus = require('./bus');
var db = require('./db');
var validation = require('./utils/validation');

module.exports = function (server) {

  var io = require('socket.io')(server),
      sockets = {},
      Donor = db.Donor;

  /**
   * Helper function for cleaning socket data.
   *
   * @param      {String}  id      Socket id.
   */
  function cleanSocketData(id) {
    delete sockets[id];
  }

  function onSocketRegisterDonor(donor, fn) {
    var errors = validation.validateDonor(donor);
    if (Object.keys(errors).length > 0) {
      return fn(errors);
    }

    Donor.create({
      firstName: donor.firstName,
      lastName: donor.lastName,
      contactNumber: donor.contactNumber,
      emailAddress: donor.emailAddress,
      bloodGroup: donor.bloodGroup,
      loc: donor.loc
    }, fn);
  }

  function onSocketFindDonors(data, fn) {
    Donor.findDonors(data.bl, data.ur, fn);
  }

  /**
   * Handles new socket connections.
   *
   * @param      {Object}  socket  New socket connection.
   */
  function onSocketConnected(socket) {

    // registering socket
    sockets[socket.id] = socket;

    // client error event
    socket.on('error', function (err) {
      debug('Socket ' + socket.id + ' error: ' + err.stack);
      cleanSocketData(socket.id);
    });

    // client disconnected
    socket.on('disconnect', function() {
      cleanSocketData(socket.id);
    });


    // Client messages
    socket.on('findDonors', function(data) {
      debug('findDonors event from socket ' + socket.id + ' with parameters ' + JSON.stringify(data));
      onSocketFindDonors(data, function (err, donors) {
        if (err) {
          return debug(err);
        }

        socket.emit('donors', donors);
      });
    });

    socket.on('registerDonor', function(data) {
      debug('registerDonor event from socket ' + socket.id + ' with parameters ' + JSON.stringify(data));
      onSocketRegisterDonor(data, function (err, donor) {
        if (err) {
          socket.emit('registerDonorError', err);
          return debug(err);
        }

        socket.emit('newDonor', donor);
        io.emit('donorsUpdate');
      });
    });
  }

  return {

    start: function (fn) {

      // handling socket connections
      io.on('connection', function(socket) {
        onSocketConnected(socket);
      });

      // handling new incoming message
      // bus.on(Events.IMAGE_RESIZE, function (msg) {
      //   onResizeMessage(msg);
      // });

      fn();
    }
  };

};
