/**
 * Created by winner-timothybolorunduro on 01/07/2017.
 */

const winston = require('winston');
const fs = require('fs');

const logDir = './../../../logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = function() {
  return (new Date()).toLocaleTimeString();
};

const errorLogger = new winston.Logger({
  transports: [
    new (winston.transports.File)({
      filename: logDir + '/errors.log',
      timestamp: tsFormat
    })
  ],
  exitOnError: false
});

const infoLogger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: tsFormat
    })
  ],
  exitOnError: false
});

/**
 * Handles all the logging needs of the app
 */
const logger = {
  /**
   * A method to print a message to the console
   * @param {String} message
   */
  log: function(message) {
    infoLogger.level = 'info';
    infoLogger.info(message);
  },

  /**
   * A method to log errors to the console
   * @param {Object} err
   */
  error: function(err) {
    errorLogger.level = 'error';
    errorLogger.error(err);
  }
};

module.exports = logger;
