/**
 * Created by bolorundurowb on 1/19/17.
 */

import supertest from 'supertest';
// eslint-disable-next-line
import should from 'should';
import sinon from 'sinon';

import app from '../src/server';
import Auth from './../src/controllers/Auth';
import ImageHandler from '../src/util/ImageHandler';

const server = supertest.agent(app);
let userToken;

describe('Auth', () => {
  after(() => {
    ImageHandler.uploadImage.restore();
  });

  before(() => {
    sinon.stub(ImageHandler, 'uploadImage').callsFake(() =>
      new Promise((resolve) => {
        resolve('http://sample-url.jpg');
      }));
  });

  describe('sign up', () => {
    describe('allows', () => {
      it('for users to be created', (done) => {
        server
          .post('/api/v1/signUp')
          .field('username', 'john.doe')
          .field('email', 'john.doe@gmail.com')
          .field('password', 'john.doe')
          .attach('profile', './tests/artifacts/sample.png')
          .expect(201)
          .end((err, res) => {
            res.status.should.equal(201);
            res.body.should.be.type('object');
            res.body.should.have.property('token');
            res.body.token.should.be.type('string');

            userToken = res.body.token;
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
            password: 'john.do'
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
            password: 'john.doe'
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
      it('resetting a valid users password', (done) => {
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

  describe('auth methods', () => {
    it('returns false when password is empty', () => {
      Auth.verifyPassword(null, null).should.equal(false);
    });
  });
});
