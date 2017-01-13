/**
 * Created by bolorundurowb on 1/13/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const app = require('./../../server');

const server = supertest.agent(app);
let id = '';

describe('Categories', () => {
  it('allows for categories to be created', (done) => {
    server
      .post('/api/v1/categories')
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

  it('doesnt allow for categories to be duplicated', (done) => {
    server
      .post('/api/v1/categories')
      .send({title: 'Tech'})
      .expect(409)
      .end(function (err, res) {
        res.status.should.equal(409);
        res.body.message.should.equal('A category exists with that title');
        done();
      });
  });

  it('doesnt allow for categories to be title-less', (done) => {
    server
      .post('/api/v1/categories')
      .send({})
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('The category requires a title');
        done();
      });
  });

  it('allows for all categories to be retrieved', (done) => {
    server
      .get('/api/v1/categories')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.length.should.equal(1);
        done();
      });
  });

  it('allows for a category to be retrieved', (done) => {
    server
      .get('/api/v1/categories/' + id)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        done();
      });
  });

  it('doesnt allow a non-existent category to be retrieved', (done) => {
    server
      .get('/api/v1/categories/507f1f77bcf86cd799439011')
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('No category exists with that id');
        done();
      });
  });

  it('handles errors with ids', (done) => {
    server
      .get('/api/v1/categories/11')
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.should.be.type('object');
        done();
      });
  });

  it('allows for categories to be updated', (done) => {
    server
      .put('/api/v1/categories/' + id)
      .send({title: 'Technology'})
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.title.should.equal('Technology');
        done();
      });
  });

  it('doesnt allow for categories to be title-less', (done) => {
    server
      .put('/api/v1/categories/' + id)
      .send({})
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('The category requires a title');
        done();
      });
  });

  it('allows for categories to be deleted', (done) => {
    server
      .delete('/api/v1/categories/' + id)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.message.should.equal('Category successfully removed');
        done();
      });
  });
});
