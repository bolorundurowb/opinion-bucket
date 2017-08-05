/**
 * Created by bolorundurowb on 1/19/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const sinon = require('sinon');
const app = require('./../../server');
const auth = require('./../../src/server/controllers/auth');
const config = require('../../src/server/config/config');

const server = supertest.agent(app);
let userToken;

describe('Auth', () => {
  describe('sign up', () => {
    describe('allows', () => {
      it('for users to be created', (done) => {
        server
          .post('/api/v1/signup')
          .field('username', 'john.doe')
          .field('email', 'john.doe@gmail.com')
          .field('password', 'john.doe')
          .attach('profile', './tests/server/artifacts/sample.png')
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
          .post('/api/v1/signup')
          .send({
            username: 'john.doe',
            password: 'john.doe'
          })
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.should.be.type('object');
            res.body.message.should.equal('A user must have an email address.');
            done();
          });
      });

      it('for users without a username to be created', (done) => {
        server
          .post('/api/v1/signup')
          .send({
            email: 'john@doe.org',
            password: 'john.doe'
          })
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.should.be.type('object');
            res.body.message.should.equal('A user must have a username.');
            done();
          });
      });

      it('for users without a password to be created', (done) => {
        server
          .post('/api/v1/signup')
          .send({
            email: 'john@doe.org',
            username: 'john.doe'
          })
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.should.be.type('object');
            res.body.message.should.equal('A user must have a password.');
            done();
          });
      });

      it('for duplicate users to be created', (done) => {
        server
          .post('/api/v1/signup')
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
          .post('/api/v1/signin')
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
          .post('/api/v1/signin')
          .send({
            username: 'jane.doe'
          })
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('A username or email and password are required');
            done();
          });
      });

      it(' for users with a wrong password to be signed in', (done) => {
        server
          .post('/api/v1/signin')
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
          .post('/api/v1/signin')
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
          .post('/api/v1/signout')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            console.log(res.body);
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.message.should.equal('sign out successful');
            done();
          });
      });
    });
  });
});
