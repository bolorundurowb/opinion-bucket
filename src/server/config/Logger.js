/**
 * Created by winner-timothybolorunduro on 01/07/2017.
 */

const winston = require('winston');
const fs = require('fs');

const logDir = './logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = function() {
  return (new Date()).toLocaleTimeString();
};

const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: tsFormat
    }),
    new (winston.transports.File)({
      filename: logDir + '/errors.log',
      timestamp: tsFormat
    })
  ],
  exitOnError: false
});

/**
 * Handles all the logging needs of the app
 */
class Logger {
  /**
   * A method to print a message to the console
   * @param {String} message
   */
  static log(message) {
    logger.level = 'info';
    logger.info(message);
  }

  /**
   * A method to log errors to the console
   * @param {Object} err
   */
  static error(err) {
    logger.level = 'error';
    logger.error('\n\n' + err);
  }
}

export default Logger;
