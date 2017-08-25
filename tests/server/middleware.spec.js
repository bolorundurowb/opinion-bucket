/**
 * Created by bolorundurowb on 2/9/17.
 */

import supertest from 'supertest';
// eslint-disable-next-line
import should from 'should';
import app from './../../server';

const server = supertest.agent(app);
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlT2ZCaXJ0aCI6IjIwMTctMDItMDRUMTM6NTg6MDkuNTk1WiIsImdlbmRlciI6IkRlY2xpbmUiLCJ0b3BpY3MiOltdLCJ0eXBlIjoiVXNlciIsIl9pZCI6IjU4OTVkZGYxNzljZDFmN2U5MWYyMDRiOSIsImVtYWlsIjoiam9obkBkb2Uub3JnIiwiaGFzaGVkUGFzc3dvcmQiOiIkMmEkMTAkaWliMHlGLzRidWZGLjAwUTVCWU5MZTFpckRtSlYvSy5EblVKd1V6ZzJhT1h1VDZsekJnUjIiLCJ1c2VybmFtZSI6ImpvaG4uZG9lIiwiam9pbmVkIjoiMjAxNy0wMi0wNFQxMzo1ODowOS44ODRaIiwiX192IjowLCJpYXQiOjE0ODYyMTY2OTAsImV4cCI6MTQ4NjQ3NTg5MH0.Mrr0MucJPfdiotWayK-Z6FeKsVzxJoCMn40vX9cR3xo';
let userToken;

describe('Middleware', () => {
  before((done) => {
    server
      .post('/api/v1/signin')
      .send({
        username: 'john.doe',
        password: 'john.doe'
      })
      .expect(200)
      .end((err, res) => {
        userToken = res.body.token;
        done();
      });
  });

  describe('authentication', () => {
    describe('does not allow', () => {
      it('expired tokens', (done) => {
        server
          .get('/api/v1/users')
          .set('x-access-token', expiredToken)
          .expect(401)
          .end((err, res) => {
            res.status.should.equal(401);
            res.body.message.should.equal('Failed to authenticate token.');
            done();
          });
      });

      it('for tokenless requests', (done) => {
        server
          .get('/api/v1/users')
          .expect(403)
          .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('You need to be logged in to access that information.');
            done();
          });
      });
    });
  });

  describe('authorization', () => {
    describe('does not allow', () => {
      it('non-moderators access moderator routes', (done) => {
        server
          .post('/api/v1/categories')
          .set('x-access-token', userToken)
          .expect(403)
          .end((err, res) => {
            res.status.should.equal(403);
            res.body.should.be.type('object');
            res.body.message.should.equal('You need to be an admin or moderator to access that information');
            done();
          });
      });

      it('non-admins access admin-only routes', (done) => {
        server
          .get('/api/v1/users')
          .set('x-access-token', userToken)
          .expect(403)
          .end((err, res) => {
            res.status.should.equal(403);
            res.body.should.be.type('object');
            res.body.message.should.equal('You need to be an admin to access that information');
            done();
          });
      });
    });
  });
});
