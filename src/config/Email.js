import NodeMailer from 'nodemailer';
import InlineCss from 'inline-css';

import Logger from './Logger';
import Config from './Config';

/**
 * Handles email sending logic
 */
class Email {
  /**
   * Sends the payload via email to the given recipient
   * @param {object} payload
   * @param {string} driver
   */
  static send(payload, driver = 'mailgun') {
    InlineCss(payload.html, { url: ' ' })
      .then((html) => {
        payload.html = html;

        if (driver === 'mailgun') {
          Email.sendWithMailgun(payload);
        }
      });
  }

  static sendWithMailgun(payload) {
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
