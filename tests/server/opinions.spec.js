/**
 * Created by bolorundurowb on 2/8/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const jwt = require('jsonwebtoken');
const app = require('./../../server');
const config = require('../../src/server/config/config');

const server = supertest.agent(app);
var id = '';
var topicId = '';
var userToken;

before(function (done) {
  var adminToken = jwt.sign({username: 'admin', type: 'Admin'}, config.secret, {
    expiresIn: '1h'
  });

  server
    .post('/api/v1/topics')
    .set('x-access-token', adminToken)
    .send({title: 'Sports'})
    .expect(201)
    .end(function (err, res) {
      topicId = res.body._id;
    });

  server
    .get('/api/v1/users')
    .set('x-access-token', adminToken)
    .expect(200)
    .end(function (err, res) {
      userToken = jwt.sign(res.body[0], config.secret, {
        expiresIn: '24h'
      });
      done();
    });
});

describe('Opinions', function () {
  // Creation Tests
  it('allows for opinions to be created', function (done) {
    server
      .post('/api/v1/opinions')
      .set('x-access-token', userToken)
      .send({
        title: 'Good Stuff',
        topicId: topicId
      })
      .expect(201)
      .end(function (err, res) {
        id = res.body._id || '';
        res.status.should.equal(201);
        res.body.should.be.type('object');
        res.body.title.should.equal('Good Stuff');
        done();
      });
  });

  it('doesn\'t allow for opinions to be without a title', function (done) {
    server
      .post('/api/v1/opinions')
      .set('x-access-token', userToken)
      .send({topicId: topicId})
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('An opinion must have an author and title');
        done();
      });
  });

  it('doesnt allow for opinions to be without a parent topic', function (done) {
    server
      .post('/api/v1/opinions')
      .set('x-access-token', userToken)
      .send({title: 'Things'})
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('An opinion must have a parent topic');
        done();
      });
  });

  it('doesnt allow for opinions to be without an existing parent topic', function (done) {
    server
      .post('/api/v1/opinions')
      .set('x-access-token', userToken)
      .send({
        title: 'Good Stuff',
        topicId: '507f1f77bcf86cd799439011'
      })
      .expect(404)
      .end(function (err, res) {
        res.status.should.equal(404);
        res.body.message.should.equal('A topic with that id doesn\'t exist');
        done();
      });
  });

  // Retrieval Tests
  it('allows for all opinions to be retrieved', function (done) {
    server
      .get('/api/v1/opinions')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        id = res.body[0]._id;
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.length.should.equal(1);
        done();
      });
  });

  it('allows for all opinions to be retrieved with query options', function (done) {
    server
      .get('/api/v1/opinions?limit=12&offset=0&order=date')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.length.should.equal(1);
        done();
      });
  });

  it('allows for all opinions to be retrieved with query options', function (done) {
    server
      .get('/api/v1/opinions?topic=507f1&order=dislikes')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.length.should.equal(1);
        done();
      });
  });

  it('allows for a opinion to be retrieved', function (done) {
    server
      .get('/api/v1/opinions/' + id)
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        done();
      });
  });

  it('doesnt allow a non-existent opinion to be retrieved', function (done) {
    server
      .get('/api/v1/opinions/507f1f77bcf86cd799439011')
      .set('x-access-token', userToken)
      .expect(400)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.message.should.equal('No opinion exists with that id');
        done();
      });
  });

  it('throws an error when a wrong id is given', function (done) {
    server
      .get('/api/v1/opinions/507f1')
      .set('x-access-token', userToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.should.be.type('object');
        res.body.message.should.equal('An error occurred when retrieving an opinion');
        done();
      });
  });

  // Update Tests
  it('allows for opinions to be updated', function (done) {
    server
      .put('/api/v1/opinions/' + id)
      .set('x-access-token', userToken)
      .send({
        title: 'Cool Stuff',
        showName: true,
        date: '2015-11-11',
        content: 'Technology is really good'
      })
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.title.should.equal('Cool Stuff');
        res.body.content.should.equal('Technology is really good');
        done();
      });
  });

  it('throws an error when an invalid id is updated', function (done) {
    server
      .put('/api/v1/opinions/507f1')
      .set('x-access-token', userToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.should.be.type('object');
        res.body.message.should.equal('An error occurred when retrieving an opinion');
        done();
      });
  });

  // Likes and Dislikes Tests
  it('allows for opinions to be liked', function (done) {
    server
      .post('/api/v1/opinions/' + id + '/like')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.likes.should.equal(1);
        done();
      });
  });

  it('allows for opinions to be disliked', function (done) {
    server
      .post('/api/v1/opinions/' + id + '/dislike')
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.dislikes.should.equal(1);
        done();
      });
  });

  // Delete Tests
  it('allows for opinions to be deleted', function (done) {
    server
      .delete('/api/v1/opinions/' + id)
      .set('x-access-token', userToken)
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.message.should.equal('Opinion successfully removed');
        done();
      });
  });

  it('throws an error when an invalid id is deleted', function (done) {
    server
      .delete('/api/v1/opinions/507f1')
      .set('x-access-token', userToken)
      .expect(500)
      .end(function (err, res) {
        res.status.should.equal(500);
        res.body.message.should.equal('An error occurred when removing an opinion');
        done();
      });
  });
});
