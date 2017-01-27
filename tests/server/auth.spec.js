/**
 * Created by bolorundurowb on 1/19/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const jwt = require('jsonwebtoken');
const app = require('./../../server');

const server = supertest.agent(app);
var userToken;

before(function () {
  userToken = jwt.sign({username: 'john.doe', email: 'john.doe@doe.org'}, '765105877C8DF471AC2B3E58801E8099', {
    expiresIn: '24h'
  });
});

describe('Auth', function () {
  // Sign out
  it('allows for users to be signed out', function (done) {
    server
      .post('/api/v1/auth/signout')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.message.should.equal('signout successful');
        done();
      });
  });

  // Sign up
  it('allows for users to be created', function (done) {
    server
      .post('/api/v1/auth/signup')
      .send({
        username: 'john.doe',
        email: 'john.doe@gmail.com',
        password: 'john.doe'
      })
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

  it('does not allow for users with incomplete details to be created', function (done) {
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
        res.body.message.should.equal('A user must have an email address, username and password defined');
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
        res.body.message.should.equal('A user with that username does not exist');
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
        res.body.message.should.equal('A username and password are required');
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
