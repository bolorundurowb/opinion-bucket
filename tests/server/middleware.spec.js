/**
 * Created by bolorundurowb on 2/9/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const jwt = require('jsonwebtoken');
const app = require('./../../server');
const config = require('../../src/server/config/config');

const server = supertest.agent(app);
var expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlT2ZCaXJ0aCI6IjIwMTctMDItMDRUMTM6NTg6MDkuNTk1WiIsImdlbmRlciI6IkRlY2xpbmUiLCJ0b3BpY3MiOltdLCJ0eXBlIjoiVXNlciIsIl9pZCI6IjU4OTVkZGYxNzljZDFmN2U5MWYyMDRiOSIsImVtYWlsIjoiam9obkBkb2Uub3JnIiwiaGFzaGVkUGFzc3dvcmQiOiIkMmEkMTAkaWliMHlGLzRidWZGLjAwUTVCWU5MZTFpckRtSlYvSy5EblVKd1V6ZzJhT1h1VDZsekJnUjIiLCJ1c2VybmFtZSI6ImpvaG4uZG9lIiwiam9pbmVkIjoiMjAxNy0wMi0wNFQxMzo1ODowOS44ODRaIiwiX192IjowLCJpYXQiOjE0ODYyMTY2OTAsImV4cCI6MTQ4NjQ3NTg5MH0.Mrr0MucJPfdiotWayK-Z6FeKsVzxJoCMn40vX9cR3xo';
var userToken;

describe('Middleware', function () {
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
        done();
      });
  });

  // Authentication Tests
  it('does not allow expired tokens', function (done) {
    server
      .get('/api/v1/users')
      .set('x-access-token', expiredToken)
      .expect(401)
      .end(function (err, res) {
        res.status.should.equal(401);
        res.body.message.should.equal('Failed to authenticate token.');
        done();
      });
  });

  it('does not allow for tokenless requests', function (done) {
    server
      .get('/api/v1/users')
      .expect(403)
      .end(function (err, res) {
        res.status.should.equal(403);
        res.body.message.should.equal('You need to be logged in to access that information.');
        done();
      });
  });

  // Authorization Tests
  it('only allows for all users to be retrieved by an admin', function (done) {
    server
      .get('/api/v1/users')
      .set('x-access-token', userToken)
      .expect(403)
      .end(function (err, res) {
        res.status.should.equal(403);
        res.body.should.be.type('object');
        res.body.message.should.equal('You need to be an admin to access that information');
        done();
      });
  });
});
