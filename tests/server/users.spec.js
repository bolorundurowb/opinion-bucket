/**
 * Created by bolorundurowb on 1/17/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const jwt = require('jsonwebtoken');
const app = require('./../../server');

const server = supertest.agent(app);
var id = '';
var userToken;
var adminToken;

before(function () {
  userToken = jwt.sign({username: 'john.doe', email: 'john.doe@doe.org'}, '765105877C8DF471AC2B3E58801E8099', {
    expiresIn: '24h'
  });

  adminToken = jwt.sign({username: 'admin', type: 'Admin'}, '765105877C8DF471AC2B3E58801E8099', {
    expiresIn: '24h'
  });
});

describe('Users', function () {
  // // Retrieval Tests
  // it('allows for all users to be retrieved', function (done) {
  //   server
  //     .get('/api/v1/users')
  //     .set('x-access-token', adminToken)
  //     .expect(200)
  //     .end(function (err, res) {
  //       res.status.should.equal(200);
  //       res.body.should.be.type('object');
  //       res.body.length.should.equal(1);
  //       done();
  //     });
  // });

  // //TODO: id is empty
  // it('allows for a user to be retrieved', function (done) {
  //   server
  //     .get('/api/v1/users/' + id)
  //     .set('x-access-token', adminToken)
  //     .expect(200)
  //     .end(function (err, res) {
  //       res.status.should.equal(200);
  //       res.body.should.be.type('object');
  //       done();
  //     });
  // });

  // it('doesnt allow a non-existent user to be retrieved', function (done) {
  //   server
  //     .get('/api/v1/users/507f1f77bcf86cd799439011')
  //     .set('x-access-token', userToken)
  //     .expect(400)
  //     .end(function (err, res) {
  //       res.status.should.equal(400);
  //       res.body.message.should.equal('No user exists with that id');
  //       done();
  //     });
  // });

  // it('throws an error when a wrong id is given', function (done) {
  //   server
  //     .get('/api/v1/users/507f1')
  //     .set('x-access-token', userToken)
  //     .expect(500)
  //     .end(function (err, res) {
  //       res.status.should.equal(500);
  //       res.body.should.be.type('object');
  //       res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "User"');
  //       done();
  //     });
  // });

  // // Update Tests
  // // it('allows for users to be updated', (done) => {
  // //   server
  // //     .put('/api/v1/users/' + id)
  // //     .send({title: 'Technology'})
  // //     .expect(200)
  // //     .end(function (err, res) {
  // //       res.status.should.equal(200);
  // //       res.body.should.be.type('object');
  // //       res.body.title.should.equal('Technology');
  // //       done();
  // //     });
  // // });

  // it('doesnt allow for users to have incomplete data', function (done) {
  //   server
  //     .put('/api/v1/users/507f1f77bcf86cd799439011')
  //     .set('x-access-token', userToken)
  //     .send({})
  //     .expect(400)
  //     .end(function (err, res) {
  //       res.status.should.equal(400);
  //       res.body.message.should.equal('The user details are not complete');
  //       done();
  //     });
  // });

  // it('throws an error when an invalid id is updated', function (done) {
  //   server
  //     .put('/api/v1/users/507f1')
  //     .set('x-access-token', userToken)
  //     .expect(500)
  //     .end(function (err, res) {
  //       res.status.should.equal(500);
  //       res.body.should.be.type('object');
  //       res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "User"');
  //       done();
  //     });
  // });

  // // Delete Tests
  // // it('allows for users to be deleted', (done) => {
  // //   server
  // //     .delete('/api/v1/users/' + id)
  // //     .expect(200)
  // //     .end(function (err, res) {
  // //       res.status.should.equal(200);
  // //       res.body.message.should.equal('User successfully removed');
  // //       done();
  // //     });
  // // });

  // it('throws an error when an invalid id is deleted', function (done) {
  //   server
  //     .delete('/api/v1/users/507f1')
  //     .set('x-access-token', userToken)
  //     .expect(500)
  //     .end(function (err, res) {
  //       res.status.should.equal(500);
  //       res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "User"');
  //       done();
  //     });
  // });
});
