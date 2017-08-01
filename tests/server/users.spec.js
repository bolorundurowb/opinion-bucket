/**
 * Created by bolorundurowb on 1/17/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const app = require('./../../server');
const config = require('../../src/server/config/config');

const server = supertest.agent(app);
var id = '';
var userToken;
var adminToken;

describe('Users', function () {
  before(function (done) {
    server
      .post('/api/v1/signin')
      .send({
        username: 'john.doe',
        password: 'john.doe'
      })
      .expect(200)
      .end(function (err, res) {
        userToken = res.body.token;

        server
          .post('/api/v1/signin')
          .send({
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASS
          })
          .expect(200)
          .end(function (err, res) {
            adminToken = res.body.token;
            done();
          });
      });
  });

  before(function (done) {
    server
      .get('/api/v1/users')
      .set('x-access-token', adminToken)
      .expect(200)
      .end(function (err, res) {
        id = res.body[0]._id;
        done();
      });
  });

  describe('retrieval', function () {
    describe('does not allow', function () {
      it('for a non-existent user to be retrieved with detail', function (done) {
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

      it('for a non-existent user to be retrieved', function (done) {
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
    });

    describe('allows', function () {
      it('for  all users to be retrieved', function (done) {
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

      it('for  a user to be retrieved', function (done) {
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

      it('for  a user to be retrieved with more detail', function (done) {
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
    });
  });

  describe('update', function () {
    describe('does not allow', function () {
      it('for  non-existent users to be updated', function (done) {
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

    });

    describe('allows', function () {
      it('for  users to be updated', function (done) {
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

      it('for  users to be updated (2)', function (done) {
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
            topics: ['507f1']
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

      it('for  users to be updated (3)', function (done) {
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
            topics: ['507f1f77bcf86cd799439011']
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

      it('for  users to be updated with photos', function (done) {
        server
          .put('/api/v1/users/' + id)
          .set('x-access-token', userToken)
          .field('lastName', 'Woke')
          .field('firstName', 'Wobe')
          .attach('profile', './tests/server/artifacts/sample.png')
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.firstName.should.equal('Wobe');
            res.body.lastName.should.equal('Woke');
            done();
          });
      });
    });
  });

  describe('deletion', function () {
    describe('does not allow', function () {
      it('for  the admin to be deleted', function (done) {
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
    });

    describe('allows', function () {
      it('for  users to be deleted', function (done) {
        server
          .get('/api/v1/users')
          .set('x-access-token', adminToken)
          .expect(200)
          .end(function (err, res) {
            // HACK: get the id of the second user order is different on CI hence the if block
            if (process.env.NODE_ENV === 'test') {
              id = res.body[1]._id;
            } else {
              id = res.body[0]._id;
            }
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
    });
  });
});
