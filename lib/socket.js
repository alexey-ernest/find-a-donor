/**
 * Socket interface data updates.
 */

var debug = require('debug')('find-a-donor:socket');
var db = require('./db');
var service = require('./services/donor.service')(db);
var validation = require('./utils/validation');

module.exports = function (server) {

  var io = require('socket.io')(server),
      sockets = {};

  /**
   * Helper function for cleaning socket data.
   *
   * @param      {String}  id      Socket id.
   */
  function cleanSocketData(id) {
    delete sockets[id];
  }

  /**
   * Handles socket donor registration event.
   *
   * @param      {Object}    donor   New donor data.
   * @param      {Function}  fn      Callback.
   */
  function onSocketRegisterDonor(donor, fn) {
    service.registerDonor(donor, fn);
  }

  /**
   * Handles socket update donor event.
   *
   * @param      {Object}    data    Updated donor data.
   * @param      {Function}  fn      Callback.
   */
  function onSocketUpdateDonor(data, fn) {
    service.updateDonor(data._id, data, fn);
  }

  /**
   * Handles socket delete event.
   *
   * @param      {string}    id      Donor id.
   * @param      {Function}  fn      Callback.
   */
  function onSocketDeleteDonor(id, fn) {
    Donor.remove({ _id: id }, fn);
  }

  /**
   * Handles socket get donor event.
   *
   * @param      {string}    id      Donor id.
   * @param      {Function}  fn      Callback.
   */
  function onSocketGetDonor(id, fn) {
    Donor.findById(id, function (err, donor) {
      if (err) return fn(err);

      if (!donor) {
        return fn(new Error('Could not find donor with id ' + id));
      }

      fn(null, donor);
    });
  }

  /**
   * Handles socket find donors event.
   *
   * @param      {Object}    data    {bl, ur} points.
   * @param      {Function}  fn      Callback.
   */
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

    socket.on('getDonor', function(id) {
      debug('getDonor event from socket ' + socket.id + ' with parameters ' + id);
      onSocketGetDonor(id, function (err, donor) {
        if (err) {
          socket.emit('getDonorError', err);
          return debug(err);
        }

        socket.emit('donor', donor);
      });
    });

    socket.on('registerDonor', function(data) {
      debug('registerDonor event from socket ' + socket.id + ' with parameters ' + JSON.stringify(data));
      onSocketRegisterDonor(data, function (err, donor) {
        if (err) {
          socket.emit('registerDonorError', err);
          return debug(err);
        }

        debug('donor ' + donor._id + ' registered successfully');

        // notify socket
        socket.emit('newDonor', donor);

        // notify all about update
        io.emit('donorsUpdate');
      });
    });

    socket.on('updateDonor', function(data) {
      debug('updateDonor event from socket ' + socket.id + ' with parameters ' + JSON.stringify(data));
      onSocketUpdateDonor(data, function (err, donor) {
        if (err) {
          socket.emit('updateDonorError', err);
          return debug(err);
        }

        debug('donor ' + data._id + ' updated successfully');

        // notify socket
        socket.emit('donorUpdated', donor);

        // notify all about update
        io.emit('donorsUpdate');
      });
    });

    socket.on('deleteDonor', function(id) {
      debug('deleteDonor event from socket ' + socket.id + ' with parameters ' + id);
      onSocketDeleteDonor(id, function (err) {
        if (err) {
          socket.emit('deleteDonorError', err);
          return debug(err);
        }

        debug('donor ' + id + ' deleted successfully');

        // notify socket
        socket.emit('donorDeleted');

        // notify all about update
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

      fn();
    }
  };

};
