import NodeMailer from 'nodemailer';

import Logger from './Logger';
import Config from './Config';

/**
 * Handles email sending logic
 */
class Email {
  /**
   * Sends the payload via email to the given recipient
   * @param {object} payload
   */
  static send(payload) {
    const credentials = {
      service: 'MailGun',
      auth: {
        user: Config.mailgun.user,
        pass: Config.mailgun.pass
      }
    };

    const transport = NodeMailer.createTransport(credentials);

    transport.sendMail(payload, (err) => {
      if (err) {
        Logger.error(err);
      } else {
        Logger.log('The email(s) was/were sent successfully.');
      }
    });
  }
}

export default Email;
