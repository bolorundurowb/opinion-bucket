/**
 * Created by bolorundurowb on 1/19/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const jwt = require('jsonwebtoken');
const app = require('./../../server');
const config = require('./../../config/config');

const server = supertest.agent(app);

describe('Auth', function () {
  // Sign out
  it('allows for users to be signed out', function (done) {
    const userToken = jwt.sign({username: 'john.doe', email: 'john.doe@doe.org'}, config.secret, {
      expiresIn: '1h'
    });
    server
      .post('/api/v1/auth/signout')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.message.should.equal('sign out successful');
        done();
      });
  });

  // Sign up
  it('allows for users to be created', function (done) {
    server
      .post('/api/v1/auth/signup')
      .field('username', 'john.doe')
      .field('email', 'john.doe@gmail.com')
      .field('password', 'john.doe')
      .attach('profile', './tests/artifacts/sample.png')
      .expect(201)
      .end(function (err, res) {
        res.status.should.equal(201);
        res.body.should.be.type('object');
        res.body.user.should.be.type('object');
        res.body.user.username.should.equal('john.doe');
        res.body.token.should.be.type('string');
        done();
      });
  });

  it('does not allow for users without an email address to be created', function (done) {
    server
      .post('/api/v1/auth/signup')
      .send({
        username: 'john.doe',
        password: 'john.doe'
      })
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.should.be.type('object');
        res.body.message.should.equal('A user must have an email address.');
        done();
      });
  });

  it('does not allow for users without a username to be created', function (done) {
    server
      .post('/api/v1/auth/signup')
      .send({
        email: 'john@doe.org',
        password: 'john.doe'
      })
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.should.be.type('object');
        res.body.message.should.equal('A user must have a username.');
        done();
      });
  });

  it('does not allow for users without a password to be created', function (done) {
    server
      .post('/api/v1/auth/signup')
      .send({
        email: 'john@doe.org',
        username: 'john.doe'
      })
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.should.be.type('object');
        res.body.message.should.equal('A user must have a password.');
        done();
      });
  });

  it('does not allow for duplicate users to be created', function (done) {
    server
      .post('/api/v1/auth/signup')
      .send({
        username: 'john.doe',
        email: 'john.doe@yahoo.org',
        password: 'john.doe'
      })
      .expect(409)
      .end(function (err, res) {
        res.status.should.equal(409);
        res.body.should.be.type('object');
        res.body.message.should.equal('A user exists with that username or email address');
        done();
      });
  });

  // Sign in
  it('allows for users to be signed in', function (done) {
    server
      .post('/api/v1/auth/signin')
      .send({
        username: 'john.doe',
        password: 'john.doe'
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.user.should.be.type('object');
        res.body.user.username.should.equal('john.doe');
        res.body.token.should.be.type('string');
        done();
      });
  });

  it('does not allow for invalid users to be signed in', function (done) {
    server
      .post('/api/v1/auth/signin')
      .send({
        username: 'jane.doe',
        password: 'john.doe'
      })
      .expect(404)
      .end(function (err, res) {
        res.status.should.equal(404);
        res.body.message.should.equal('A user with that username or email does not exist');
        done();
      });
  });

  it('does not allow for users without password to be signed in', function (done) {
    server
      .post('/api/v1/auth/signin')
      .send({
        username: 'jane.doe'
      })
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('A username or email and password are required');
        done();
      });
  });

  it('does not allow for users with a wrong password to be signed in', function (done) {
    server
      .post('/api/v1/auth/signin')
      .send({
        username: 'john.doe',
        password: 'john.do'
      })
      .expect(403)
      .end(function (err, res) {
        res.status.should.equal(403);
        res.body.message.should.equal('The passwords did not match');
        done();
      });
  });
});
