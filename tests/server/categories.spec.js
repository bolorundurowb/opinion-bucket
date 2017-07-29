/**
 * Created by bolorundurowb on 1/13/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const jwt = require('jsonwebtoken');
const app = require('./../../server');
const config = require('../../src/server/config/config');

const server = supertest.agent(app);
var id = '';
var userToken;
var adminToken;

describe('Categories', function () {
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

  // Creation Tests
  it('allows for categories to be created', function (done) {
    server
      .post('/api/v1/categories')
      .set('x-access-token', adminToken)
      .send({title: 'Tech'})
      .expect(201)
      .end(function (err, res) {
        id = res.body._id || '';
        res.status.should.equal(201);
        res.body.should.be.type('object');
        res.body.title.should.equal('Tech');
        done();
      });
  });

  it('doesnt allow for categories to be duplicated', function (done) {
    server
      .post('/api/v1/categories')
      .set('x-access-token', adminToken)
      .send({title: 'Tech'})
      .expect(409)
      .end(function (err, res) {
        res.status.should.equal(409);
        res.body.message.should.equal('A category exists with that title');
        done();
      });
  });

  it('doesnt allow for categories to be title-less', function (done) {
    server
      .post('/api/v1/categories')
      .set('x-access-token', adminToken)
      .send({})
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('The category requires a title');
        done();
      });
  });

  // Retrieval Tests
  it('allows for all categories to be retrieved', function (done) {
    server
      .get('/api/v1/categories')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.length.should.equal(1);
        done();
      });
  });

  it('allows for a category to be retrieved', function (done) {
    server
      .get('/api/v1/categories/' + id)
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        done();
      });
  });

  it('doesnt allow a non-existent category to be retrieved', function (done) {
    server
      .get('/api/v1/categories/507f1f77bcf86cd799439011')
      .set('x-access-token', userToken)
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('No category exists with that id');
        done();
      });
  });

  it('throws an error when a wrong id is given', function (done) {
    server
      .get('/api/v1/categories/507f1')
      .set('x-access-token', userToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.should.be.type('object');
        res.body.message.should.equal('An error occurred when retrieving a category');
        done();
      });
  });

  // Update Tests
  it('allows for categories to be updated', function (done) {
    server
      .put('/api/v1/categories/' + id)
      .set('x-access-token', adminToken)
      .send({title: 'Technology'})
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.title.should.equal('Technology');
        done();
      });
  });

  it('doesnt allow for categories to be title-less', function (done) {
    server
      .put('/api/v1/categories/' + id)
      .set('x-access-token', adminToken)
      .send({})
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('The category requires a title');
        done();
      });
  });

  it('throws an error when an invalid id is updated', function (done) {
    server
      .put('/api/v1/categories/507f1')
      .set('x-access-token', adminToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.should.be.type('object');
        res.body.message.should.equal('An error occurred when retrieving a category');
        done();
      });
  });

  // Delete Tests
  it('allows for categories to be deleted', function (done) {
    server
      .delete('/api/v1/categories/' + id)
      .set('x-access-token', adminToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.message.should.equal('Category successfully removed');
        done();
      });
  });

  it('throws an error when an invalid id is deleted', function (done) {
    server
      .delete('/api/v1/categories/507f1')
      .set('x-access-token', adminToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.message.should.equal('An error occurred when removing a category');
        done();
      });
  });
});
