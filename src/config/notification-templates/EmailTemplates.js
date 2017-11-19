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
      from: 'admin@opinion-bucket.io',
      to: recipient,
      subject: 'Welcome',
      text: `Hello There,
             Thanks for signing up with Opinion Bucket. Welcome to a community of excellence, where you can share and gain knowledge.
             Thank you`,
      html: ejs.render(templateString, {})
    };
  }

  /**
   * Returns the email for a new user signUp
   * @param {string} recipient
   * @param {string} resetLink
   * @returns {object} - a new user welcome email
   */
  static getForgotPasswordMail(recipient, resetLink) {
    const templateString = fs.readFileSync(path.join(path.dirname(path.dirname(__dirname)), 'templates', 'forgot-password.ejs'), 'utf8');

    return {
      from: 'admin@opinion-bucket.io',
      to: recipient,
      subject: 'Password Recovery',
      text: `Sorry you forgot your password. We made a reset link just for you 'cause you are special to us. You can reset your password by visiting ${resetLink}. The reset link expires in 12 hours.
          Yours, <br>
          The Opinion Bucket Team.`,
      html: ejs.render(templateString, { resetLink })
    };
  }

  /**
   * Returns the email for a new user signUp
   * @param {string} recipient
   * @param {string} resetLink
   * @returns {object} - a new user welcome email
   */
  static getResetPasswordMail(recipient) {
    const templateString = fs.readFileSync(path.join(path.dirname(path.dirname(__dirname)), 'templates', 'reset-password.ejs'), 'utf8');

    return {
      from: 'admin@opinion-bucket.io',
      to: recipient,
      subject: 'Reset Successful',
      text: `hey there, you have successfully reset your password
          Yours, <br>
          The Opinion Bucket Team.`,
      html: ejs.render(templateString, {})
    };
  }
}

export default EmailTemplates;
