/**
 * Created by bolorundurowb on 1/17/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const jwt = require('jsonwebtoken');
const app = require('./../../server');
const config = require('./../../config/config');

const server = supertest.agent(app);
var id = '';
var userToken;
var adminToken;

before(function (done) {
  userToken = jwt.sign({username: 'john.doe'}, config.secret, {
    expiresIn: '24h'
  });

  adminToken = jwt.sign({username: 'admin', type: 'Admin'}, config.secret, {
    expiresIn: '24h'
  });

  server
    .get('/api/v1/users')
    .set('x-access-token', adminToken)
    .expect(200)
    .end(function (err, res) {
      id = res.body[0]._id;
      done();
    });
});

describe('Users', function () {
  // Retrieval Tests
  it('allows for all users to be retrieved', function (done) {
    server
      .get('/api/v1/users')
      .set('x-access-token', adminToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        // One admin and one registered user
        res.body.length.should.equal(2);
        done();
      });
  });

  it('allows for a user to be retrieved', function (done) {
    server
      .get('/api/v1/users/' + id)
      .set('x-access-token', adminToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        done();
      });
  });

  it('allows for a user to be retrieved with more detail', function (done) {
    server
      .get('/api/v1/users/' + id + '/full')
      .set('x-access-token', adminToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        done();
      });
  });

  it('doesnt allow a non-existent user to be retrieved with detail', function (done) {
    server
      .get('/api/v1/users/507f1f77bcf86cd799439011/full')
      .set('x-access-token', userToken)
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('No user exists with that id');
        done();
      });
  });

  it('doesnt allow a non-existent user to be retrieved', function (done) {
    server
      .get('/api/v1/users/507f1f77bcf86cd799439011')
      .set('x-access-token', userToken)
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('No user exists with that id');
        done();
      });
  });

  it('throws an error when a wrong id is given', function (done) {
    server
      .get('/api/v1/users/507f1')
      .set('x-access-token', userToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.should.be.type('object');
        res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "User"');
        done();
      });
  });

  // Update Tests
  it('allows for users to be updated', function (done) {
    server
      .put('/api/v1/users/' + id)
      .set('x-access-token', userToken)
      .send({
        lastName: 'Woke',
        firstName: 'Wobe',
        password: 'Youknowwho',
        username: 'admin',
        email: 'admin@opinionbucket.io',
        gender: 'Male',
        dateOfBirth: '1909-12-12',
        profilePhoto: 'http://google.com',
        topics: ['507f1', '507f1f77bcf86cd799439011']
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.firstName.should.equal('Wobe');
        res.body.lastName.should.equal('Woke');
        done();
      });
  });

  it('allows for users to be updated (2)', function (done) {
    server
      .put('/api/v1/users/' + id)
      .set('x-access-token', userToken)
      .send({
        lastName: 'Woke',
        firstName: 'Wobe',
        password: 'Youknowwho',
        gender: 'Male',
        dateOfBirth: '1909-12-12',
        profilePhoto: 'http://google.com',
        topics: '507f1'
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.firstName.should.equal('Wobe');
        res.body.lastName.should.equal('Woke');
        done();
      });
  });

  it('allows for users to be updated (3)', function (done) {
    server
      .put('/api/v1/users/' + id)
      .set('x-access-token', userToken)
      .send({
        lastName: 'Woke',
        firstName: 'Wobe',
        password: 'Youknowwho',
        gender: 'Male',
        dateOfBirth: '1909-12-12',
        profilePhoto: 'http://google.com',
        topics: '507f1f77bcf86cd799439011'
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.firstName.should.equal('Wobe');
        res.body.lastName.should.equal('Woke');
        done();
      });
  });

  it('does not allow for non-existemt users to be updated', function (done) {
    server
      .put('/api/v1/users/507f1f77bcf86cd799439011')
      .set('x-access-token', userToken)
      .send({
        lastName: 'Woke'
      })
      .expect(404)
      .end(function (err, res) {
        res.status.should.equal(404);
        res.body.should.be.type('object');
        res.body.message.should.equal('No user with that id');
        done();
      });
  });

  it('throws an error when an invalid id is updated', function (done) {
    server
      .put('/api/v1/users/507f1')
      .set('x-access-token', userToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.should.be.type('object');
        res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "User"');
        done();
      });
  });

  // Delete Tests
  it('does not allow for the admin to be deleted', function (done) {
    server
      .get('/api/v1/users')
      .set('x-access-token', adminToken)
      .expect(200)
      .end(function (err, res) {
        id = res.body[1]._id;
      });

    server
      .delete('/api/v1/users/' + id)
      .set('x-access-token', userToken)
      .expect(403)
      .end(function (err, res) {
        res.status.should.equal(403);
        res.body.message.should.equal('Admin cannot be removed');
        done();
      });
  });

  it('throws an error when an invalid id is deleted', function (done) {
    server
      .delete('/api/v1/users/507f1')
      .set('x-access-token', userToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "User"');
        done();
      });
  });

  it('allows for users to be deleted', function (done) {
    server
      .delete('/api/v1/users/' + id)
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.message.should.equal('User successfully removed');
        done();
      });
  });
});
