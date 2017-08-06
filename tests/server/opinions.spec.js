/**
 * Created by bolorundurowb on 2/8/17.
 */

import supertest from 'supertest';
// eslint-disable-next-line
import should from 'should';
import app from './../../server';
import config from '../../src/server/config/config';

const server = supertest.agent(app);
let id = '';
let topicId = '';
let userToken;
let adminToken;

describe('Opinions', () => {
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
      .post('/api/v1/topics')
      .set('x-access-token', adminToken)
      .send({title: 'Sports'})
      .expect(201)
      .end((err, res) => {
        topicId = res.body._id;
        done();
      });
  });

  describe('creation', () => {
    describe('does not allow', () => {
      it('for opinions to be without a title', (done) => {
        server
          .post('/api/v1/opinions')
          .set('x-access-token', userToken)
          .send({topicId: topicId})
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('An opinion must have an author and title');
            done();
          });
      });

      it('for opinions to be without a parent topic', (done) => {
        server
          .post('/api/v1/opinions')
          .set('x-access-token', userToken)
          .send({title: 'Things'})
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('An opinion must have a parent topic');
            done();
          });
      });

      it('for opinions to be without an existing parent topic', (done) => {
        server
          .post('/api/v1/opinions')
          .set('x-access-token', userToken)
          .send({
            title: 'Good Stuff',
            topicId: '507f1f77'
          })
          .expect(404)
          .end((err, res) => {
            res.status.should.equal(404);
            res.body.message.should.equal('A topic with that id doesn\'t exist');
            done();
          });
      });
    });

    describe('allows', () => {
      it('for opinions to be created', (done) => {
        server
          .post('/api/v1/opinions')
          .set('x-access-token', userToken)
          .send({
            title: 'Good Stuff',
            topicId: topicId
          })
          .expect(201)
          .end((err, res) => {
            id = res.body._id;
            res.status.should.equal(201);
            res.body.should.be.type('object');
            res.body.title.should.equal('Good Stuff');
            done();
          });
      });
    });
  });

  describe('updating', () => {
    describe('allows', () => {
      it('for opinions to be updated', (done) => {
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
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.title.should.equal('Cool Stuff');
            res.body.content.should.equal('Technology is really good');
            done();
          });
      });
    });
  });

  describe('retrieval', () => {
    describe('does not allow', () => {
      it('for a non-existent opinion to be retrieved', (done) => {
        server
          .get('/api/v1/opinions/507f1f77bcf86cd799439011')
          .set('x-access-token', userToken)
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('No opinion exists with that id');
            done();
          });
      });
    });

    describe('allows', () => {
      it('for all opinions to be retrieved', (done) => {
        server
          .get('/api/v1/opinions')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            id = res.body[0]._id;
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(1);
            done();
          });
      });

      it('for all opinions to be retrieved with query options', (done) => {
        server
          .get('/api/v1/opinions?limit=12&offset=0&order=date')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(1);
            done();
          });
      });

      it('for all opinions to be retrieved with other query options', (done) => {
        server
          .get('/api/v1/opinions?topic=' + topicId + '&order=dislikes')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(1);
            done();
          });
      });

      it('for all opinions to be retrieved with even more query options', (done) => {
        server
          .get('/api/v1/opinions?author=&order=likes')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(1);
            done();
          });
      });

      it('for an opinion to be retrieved', (done) => {
        server
          .get('/api/v1/opinions/' + id)
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            done();
          });
      });
    });
  });

  describe('likes and dislikes', () => {
    describe('allows', () => {
      it('for opinions to be liked', (done) => {
        server
          .post('/api/v1/opinions/' + id + '/like')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.likes.should.equal(1);
            done();
          });
      });

      it('for opinions to be disliked', (done) => {
        server
          .post('/api/v1/opinions/' + id + '/dislike')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.dislikes.should.equal(1);
            done();
          });
      });
    });
  });

  describe('deletion', () => {
    describe('allows', () => {
      it('for opinions to be deleted', (done) => {
        server
          .delete('/api/v1/opinions/' + id)
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.message.should.equal('Opinion successfully removed');
            done();
          });
      });
    });
  });
});
