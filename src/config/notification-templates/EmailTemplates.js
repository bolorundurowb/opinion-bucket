import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

/**
 * Handles generating the email objects
 */
class EmailTemplates {
  /**
   * Returns the email for a new user signup
   * @param {object}user
   * @returns {object} - a new user welcome email
   */
  static getSignUpMail(user) {
    return user;
  }
}

export default EmailTemplates;
