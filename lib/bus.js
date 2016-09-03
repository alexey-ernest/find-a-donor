/**
 * Simple centralized mechanism for sending and receiving events inside on process.

 * For complex scenarios this should be implemented using service bus service.
 */

var events = require('events');

module.exports = new events.EventEmitter();
