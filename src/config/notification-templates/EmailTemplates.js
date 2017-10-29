import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

/**
 * Handles generating the email objects
 */
class EmailTemplates {
  /**
   * Returns the email for a new user signUp
   * @param {string} recipient
   * @returns {object} - a new user welcome email
   */
  static getSignUpMail(recipient) {
    const templateString = fs.readFileSync(path.join(path.dirname(path.dirname(__dirname)), 'templates', 'welcome.ejs'), 'utf8');

    return {
      from: 'Opinion Bucket <admin@opinion-bucket.io>',
      to: recipient,
      subject: 'Welcome',
      text: `Hello There,
             Thanks for signing up with Opinion Bucket. Welcome to a community of excellence, where you can share and gain knowledge.
             Thank you`,
      html: ejs.render(templateString, {})
    };
  }
}

export default EmailTemplates;
