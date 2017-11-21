/**
 * Created by bolorundurowb on 1/19/17.
 */

import supertest from 'supertest';
// eslint-disable-next-line
import should from 'should';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';

import app from '../src/server';
import Config from './../src/config/Config';
import Logger from './../src/config/Logger';
import Auth from './../src/controllers/Auth';
import Email from './../src/config/Email';
import ImageHandler from '../src/util/ImageHandler';

const server = supertest.agent(app);
let userToken;
let userId;

describe('Auth', () => {
  after(() => {
    ImageHandler.uploadImage.restore();
    Email.sendWithMailgun.restore();
  });

  before(() => {
    sinon.stub(ImageHandler, 'uploadImage').callsFake(() =>
      new Promise((resolve) => {
        resolve('http://sample-url.jpg');
      }));

    sinon.stub(Email, 'sendWithMailgun').callsFake(() => {
      Logger.log('Email sent.');
    });
  });

  describe('sign up', () => {
    describe('allows', () => {
      it('for users to be created', (done) => {
        server
          .post('/api/v1/signUp')
          .field('username', 'john.doe')
          .field('email', 'john.doe@gmail.com')
          .field('password', 'john.do')
          .attach('profile', './tests/artifacts/sample.png')
          .expect(201)
          .end((err, res) => {
            res.status.should.equal(201);
            res.body.should.be.type('object');
            res.body.should.have.property('token');
            res.body.token.should.be.type('string');

            userToken = res.body.token;
            userId = res.body.user._id;
            done();
          });
      });
    });

    describe('does not allow', () => {
      it('for users without an email address to be created', (done) => {
        server
          .post('/api/v1/signUp')
          .send({
            username: 'john.doe',
            password: 'john.doe'
          })
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.should.be.type('object');
            res.body.message.should.equal('An email address is required.');
            done();
          });
      });

      it('for users without a username to be created', (done) => {
        server
          .post('/api/v1/signUp')
          .send({
            email: 'john@doe.org',
            password: 'john.doe'
          })
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.should.be.type('object');
            res.body.message.should.equal('A username is required.');
            done();
          });
      });

      it('for users without a password to be created', (done) => {
        server
          .post('/api/v1/signUp')
          .send({
            email: 'john@doe.org',
            username: 'john.doe'
          })
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.should.be.type('object');
            res.body.message.should.equal('A password is required.');
            done();
          });
      });

      it('for duplicate users to be created', (done) => {
        server
          .post('/api/v1/signUp')
          .send({
            username: 'john.doe',
            email: 'john.doe@yahoo.org',
            password: 'john.doe'
          })
          .expect(409)
          .end((err, res) => {
            res.status.should.equal(409);
            res.body.should.be.type('object');
            res.body.message.should.equal('A user exists with that username or email address');
            done();
          });
      });
    });
  });

  describe('sign in', () => {
    describe('does not allow', () => {
      it(' for invalid users to be signed in', (done) => {
        server
          .post('/api/v1/signIn')
          .send({
            username: 'jane.doe',
            password: 'john.doe'
          })
          .expect(404)
          .end((err, res) => {
            res.status.should.equal(404);
            res.body.message.should.equal('A user with that username or email does not exist');
            done();
          });
      });

      it(' for users without password to be signed in', (done) => {
        server
          .post('/api/v1/signIn')
          .send({
            username: 'jane.doe'
          })
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('A password is required.');
            done();
          });
      });

      it(' for users with a wrong password to be signed in', (done) => {
        server
          .post('/api/v1/signIn')
          .send({
            username: 'john.doe',
            password: 'john.d'
          })
          .expect(403)
          .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('The passwords did not match');
            done();
          });
      });
    });

    describe('allows', () => {
      it('for users to be signed in', (done) => {
        server
          .post('/api/v1/signIn')
          .send({
            username: 'john.doe',
            password: 'john.do'
          })
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.should.have.property('token');
            res.body.token.should.be.type('string');
            done();
          });
      });
    });
  });

  describe('sign out', () => {
    describe('allows', () => {
      it('for users to be signed out', (done) => {
        server
          .post('/api/v1/signOut')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.message.should.equal('sign out successful');
            done();
          });
      });
    });
  });

  describe('forgot password', () => {
    describe('doesn\'t allow for', () => {
      it('making a request without a username or email', (done) => {
        server
          .post('/api/v1/forgotPassword')
          .send({})
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('A username or email address is required.');
            done();
          });
      });

      it('making a request with a non-existent username', (done) => {
        server
          .post('/api/v1/forgotPassword')
          .send({
            data: 'hhjeiuw'
          })
          .end((err, res) => {
            res.status.should.equal(404);
            res.body.message.should.equal('A user with that username or email doesn\'t exist.');
            done();
          });
      });
    });

    describe('allows for', () => {
      it('requesting a reset for a valid user', (done) => {
        server
          .post('/api/v1/forgotPassword')
          .send({
            data: 'john.doe'
          })
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.message.should.equal('A password recovery email has been sent.');
            done();
          });
      });
    });
  });

  describe('reset password', () => {
    let existingUserToken;
    let expiredToken;
    let nonExistentUserToken;

    before(() => {
      expiredToken = jwt.sign({ id: 'xxxxx' }, Config.secret, {
        expiresIn: '0s'
      });

      nonExistentUserToken = jwt.sign({ id: 'xxxxx' }, Config.secret, {
        expiresIn: '12m'
      });

      existingUserToken = jwt.sign({ id: userId }, Config.secret, {
        expiresIn: '12m'
      });
    });

    describe('doesn\'t allow', () => {
      it('for resetting without a token', (done) => {
        server
          .post('/api/v1/resetPassword')
          .send({})
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('A reset token is required.');
            done();
          });
      });

      it('for resetting without a password', (done) => {
        server
          .post('/api/v1/resetPassword')
          .send({
            token: 'xxxxxx'
          })
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('A new password is required.');
            done();
          });
      });

      it('for resetting with an invalid token', (done) => {
        server
          .post('/api/v1/resetPassword')
          .send({
            token: 'xxxxxx',
            password: 'xxxxxxxxx'
          })
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('The provided token is either expired or invalid.');
            done();
          });
      });

      it('for resetting with an expired token', (done) => {
        server
          .post('/api/v1/resetPassword')
          .send({
            token: expiredToken,
            password: 'xxxxxxxxx'
          })
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('The provided token is either expired or invalid.');
            done();
          });
      });

      it('for resetting with a non-existent user', (done) => {
        server
          .post('/api/v1/resetPassword')
          .send({
            token: nonExistentUserToken,
            password: 'xxxxxxxxx'
          })
          .end((err, res) => {
            res.status.should.equal(404);
            res.body.message.should.equal('A user with that id doesn\'t exist.');
            done();
          });
      });

      it('for resetting with a new password same as the old password', (done) => {
        server
          .post('/api/v1/resetPassword')
          .send({
            token: existingUserToken,
            password: 'john.do'
          })
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('The new password cannot be the same as the old.');
            done();
          });
      });
    });

    describe('allows', () => {
      it('for an existing user to get his/api/v1/her password reset', (done) => {
        server
          .post('/api/v1/resetPassword')
          .send({
            token: existingUserToken,
            password: 'john.doe'
          })
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.message.should.equal('Your password has been reset.');
            done();
          });
      });
    });
  });

  describe('auth methods', () => {
    it('returns false when password is empty', () => {
      Auth.verifyPassword(null, null).should.equal(false);
    });
  });
});
