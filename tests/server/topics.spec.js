/**
 * Created by bolorundurowb on 1/16/17.
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

before(function () {
  userToken = jwt.sign({username: 'john.doe'}, config.secret, {
    expiresIn: '24h'
  });

  adminToken = jwt.sign({username: 'admin', type: 'Admin'}, config.secret, {
    expiresIn: '24h'
  });
});

describe('Topics', function () {
  //Creation tests
  it('allows for topics to be created', function (done) {
    server
      .post('/api/v1/topics')
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

  it('doesnt allow for topics to be duplicated', function (done) {
    server
      .post('/api/v1/topics')
      .set('x-access-token', adminToken)
      .send({title: 'Tech'})
      .expect(409)
      .end(function (err, res) {
        res.status.should.equal(409);
        res.body.message.should.equal('A topic exists with that title');
        done();
      });
  });

  it('doesnt allow for topics to be title-less', function (done) {
    server
      .post('/api/v1/topics')
      .set('x-access-token', adminToken)
      .send({})
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('The topic requires a title');
        done();
      });
  });

  // Retrieval Tests
  it('allows for all topics to be retrieved', function (done) {
    server
      .get('/api/v1/topics')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.length.should.equal(2);
        done();
      });
  });

  it('allows for topics to be retrieved with query options', function (done) {
    server
      .get('/api/v1/topics?limit=12&offset=10&order=date')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.length.should.equal(0);
        done();
      });
  });

  it('allows for topics to be retrieved with query options but sanitizes input', function (done) {
    server
      .get('/api/v1/topics?category=50e76f592&order=opinion')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.length.should.equal(2);
        done();
      });
  });

  it('allows for a topic to be retrieved', function (done) {
    server
      .get('/api/v1/topics/' + id)
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        done();
      });
  });

  it('allows for a topic to be retrieved with more detail', function (done) {
    server
      .get('/api/v1/topics/' + id + '/full')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        done();
      });
  });

  it('doesnt allow a non-existent topic to be retrieved', function (done) {
    server
      .get('/api/v1/topics/507f1f77bcf86cd799439011')
      .set('x-access-token', userToken)
      .expect(404)
      .end(function (err, res) {
        res.status.should.equal(404);
        res.body.message.should.equal('No topic exists with that id');
        done();
      });
  });

  it('doesnt allow a non-existent topic to be retrieved with more detail', function (done) {
    server
      .get('/api/v1/topics/507f1f77bcf86cd799439011/full')
      .set('x-access-token', userToken)
      .expect(404)
      .end(function (err, res) {
        res.status.should.equal(404);
        res.body.message.should.equal('No topic exists with that id');
        done();
      });
  });

  it('throws an error when a wrong id is given', function (done) {
    server
      .get('/api/v1/topics/507f1')
      .set('x-access-token', userToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.should.be.type('object');
        res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "Topic"');
        done();
      });
  });

  // Update Tests
  it('allows for topics to be updated', function (done) {
    server
      .put('/api/v1/topics/' + id)
      .set('x-access-token', userToken)
      .send({
        title: 'Technology',
        content: 'New content',
        categories: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd79']
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.title.should.equal('Technology');
        res.body.content.should.equal('New content');
        done();
      });
  });

  it('alerts the user when the category ids are wrong', function (done) {
    server
      .put('/api/v1/topics/' + id)
      .set('x-access-token', userToken)
      .send({
        categories: '507f1f77bcf86cd79'
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        done();
      });
  });

  it('alerts the user when a non-existent id is entered', function (done) {
    server
      .put('/api/v1/topics/507f1f77bcf86cd799439011')
      .set('x-access-token', userToken)
      .expect(404)
      .end(function (err, res) {
        res.status.should.equal(404);
        res.body.should.be.type('object');
        res.body.message.should.equal('A topic with that id doesn\'t exist');
        done();
      });
  });

  it('throws an error when an invalid id is updated', function (done) {
    server
      .put('/api/v1/topics/507f1')
      .set('x-access-token', userToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.should.be.type('object');
        res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "Topic"');
        done();
      });
  });

  // Delete Tests
  it('allows for topics to be deleted', function (done) {
    server
      .delete('/api/v1/topics/' + id)
      .set('x-access-token', adminToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.message.should.equal('Topic successfully removed');
        done();
      });
  });

  it('throws an error when an invalid id is deleted', function (done) {
    server
      .delete('/api/v1/topics/507f1')
      .set('x-access-token', adminToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "Topic"');
        done();
      });
  });
});
