/**
 * Created by bolorundurowb on 1/16/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const app = require('./../../server');

const server = supertest.agent(app);
let id = '';

describe('Topics', () => {
  it('allows for topics to be created', (done) => {
    server
      .post('/api/v1/topics')
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

  it('doesnt allow for topics to be duplicated', (done) => {
    server
      .post('/api/v1/topics')
      .send({title: 'Tech'})
      .expect(409)
      .end(function (err, res) {
        res.status.should.equal(409);
        res.body.message.should.equal('A topic exists with that title');
        done();
      });
  });

  it('doesnt allow for topics to be title-less', (done) => {
    server
      .post('/api/v1/topics')
      .send({})
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('The topic requires a title');
        done();
      });
  });

  it('allows for all topics to be retrieved', (done) => {
    server
      .get('/api/v1/topics')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.length.should.equal(1);
        done();
      });
  });

  it('allows for a topic to be retrieved', (done) => {
    server
      .get('/api/v1/topics/' + id)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        done();
      });
  });

  it('doesnt allow a non-existent topic to be retrieved', (done) => {
    server
      .get('/api/v1/topics/507f1f77bcf86cd799439011')
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('No topic exists with that id');
        done();
      });
  });

  it('throws an error when a wrong id is given', (done) => {
    server
      .get('/api/v1/topics/507f1')
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.should.be.type('object');
        res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "Topic"');
        done();
      });
  });

  // Update Tests
  it('allows for topics to be updated', (done) => {
    server
      .put('/api/v1/topics/' + id)
      .send({title: 'Technology'})
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.title.should.equal('Technology');
        done();
      });
  });

  it('doesnt allow for topics to be title-less', (done) => {
    server
      .put('/api/v1/topics/' + id)
      .send({})
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('The topic requires a title');
        done();
      });
  });

  it('throws an error when an invalid id is updated', (done) => {
    server
      .delete('/api/v1/topics/507f1')
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "Topic"');
        done();
      });
  });

  // Delete Tests
  it('allows for topics to be deleted', (done) => {
    server
      .delete('/api/v1/topics/' + id)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.message.should.equal('Topic successfully removed');
        done();
      });
  });

  it('throws an error when an invalid id is deleted', (done) => {
    server
      .delete('/api/v1/topics/507f1')
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.message.should.equal('Cast to ObjectId failed for value "507f1" at path "_id" for model "Topic"');
        done();
      });
  });
});
