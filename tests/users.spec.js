/**
 * Created by bolorundurowb on 1/17/17.
 */

import supertest from 'supertest';
// eslint-disable-next-line
import should from 'should';
import sinon from 'sinon';
import app from '../src/server';
import Auth from '../src/controllers/Auth';

const server = supertest.agent(app);
let id = '';
let userToken;
let adminToken;

describe('Users', () => {
  after(() => {
    Auth.uploadImage.restore();
  });

  before(() => {
    sinon.stub(Auth, 'uploadImage').callsFake(() =>
      new Promise((resolve) => {
        resolve('http://sample-url.jpg');
      }));
  });

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

        server
          .post('/api/v1/signin')
          .send({
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASS
          })
          .expect(200)
          .end((err, res) => {
            adminToken = res.body.token;
            done();
          });
      });
  });

  before((done) => {
    server
      .get('/api/v1/users')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        id = res.body[0]._id;
        done();
      });
  });

  describe('retrieval', () => {
    describe('does not allow', () => {
      it('for a non-existent user to be retrieved with detail', (done) => {
        server
          .get('/api/v1/users/507f1f77bcf86cd799439011/full')
          .set('x-access-token', userToken)
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('No user exists with that id');
            done();
          });
      });

      it('for a non-existent user to be retrieved', (done) => {
        server
          .get('/api/v1/users/507f1f77bcf86cd799439011')
          .set('x-access-token', userToken)
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('No user exists with that id');
            done();
          });
      });
    });

    describe('allows', () => {
      it('for  all users to be retrieved', (done) => {
        server
          .get('/api/v1/users')
          .set('x-access-token', adminToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            // One admin and one registered user
            res.body.length.should.equal(2);
            done();
          });
      });

      it('for  a user to be retrieved', (done) => {
        server
          .get(`/api/v1/users/${id}`)
          .set('x-access-token', adminToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            done();
          });
      });

      it('for  a user to be retrieved with more detail', (done) => {
        server
          .get(`/api/v1/users/${id}/full`)
          .set('x-access-token', adminToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            done();
          });
      });
    });
  });

  describe('update', () => {
    describe('does not allow', () => {
      it('for  non-existent users to be updated', (done) => {
        server
          .put('/api/v1/users/507f1f77bcf86cd799439011')
          .set('x-access-token', userToken)
          .send({
            lastName: 'Woke'
          })
          .expect(404)
          .end((err, res) => {
            res.status.should.equal(404);
            res.body.should.be.type('object');
            res.body.message.should.equal('No user with that id');
            done();
          });
      });
    });

    describe('allows', () => {
      it('for  users to be updated', (done) => {
        server
          .put(`/api/v1/users/${id}`)
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
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.firstName.should.equal('Wobe');
            res.body.lastName.should.equal('Woke');
            done();
          });
      });

      it('for  users to be updated (2)', (done) => {
        server
          .put(`/api/v1/users/${id}`)
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
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.firstName.should.equal('Wobe');
            res.body.lastName.should.equal('Woke');
            done();
          });
      });

      it('for  users to be updated (3)', (done) => {
        server
          .put(`/api/v1/users/${id}`)
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
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.firstName.should.equal('Wobe');
            res.body.lastName.should.equal('Woke');
            done();
          });
      });

      it('for  users to be updated with photos', (done) => {
        server
          .put(`/api/v1/users/${id}`)
          .set('x-access-token', userToken)
          .field('lastName', 'Woke')
          .field('firstName', 'Wobe')
          .attach('profile', './tests/artifacts/sample.png')
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.firstName.should.equal('Wobe');
            res.body.lastName.should.equal('Woke');
            done();
          });
      });
    });
  });

  describe('deletion', () => {
    describe('does not allow', () => {
      it('for  the admin to be deleted', (done) => {
        server
          .delete(`/api/v1/users/${id}`)
          .set('x-access-token', userToken)
          .expect(403)
          .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('Admin cannot be removed');
            done();
          });
      });
    });

    describe('allows', () => {
      it('for  users to be deleted', (done) => {
        server
          .get('/api/v1/users')
          .set('x-access-token', adminToken)
          .expect(200)
          .end((err, res) => {
            id = res.body[1]._id;
            server
              .delete(`/api/v1/users/${id}`)
              .set('x-access-token', userToken)
              .expect(200)
              .end((err, res) => {
                res.status.should.equal(200);
                res.body.message.should.equal('User successfully removed');
                done();
              });
          });
      });
    });
  });
});
