/**
 * Created by bolorundurowb on 1/16/17.
 */

import supertest from 'supertest';
// eslint-disable-next-line
import should from 'should';
import app from '../src/server';

const server = supertest.agent(app);
let id = '';
let topicId = '';
let opinionId = '';
let userToken;
let adminToken;

describe('Topics', () => {
  before((done) => {
    server
      .post('/api/v1/signIn')
      .send({
        username: 'john.doe',
        password: 'john.doe'
      })
      .expect(200)
      .end((err, res) => {
        userToken = res.body.token;

        server
          .post('/api/v1/signIn')
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

  describe('creation', () => {
    describe('allows', () => {
      it('for topics to be created', (done) => {
        server
          .post('/api/v1/topics')
          .set('x-access-token', adminToken)
          .send({ title: 'Tech' })
          .expect(201)
          .end((err, res) => {
            id = res.body._id || '';
            res.status.should.equal(201);
            res.body.should.be.type('object');
            res.body.title.should.equal('Tech');
            done();
          });
      });
    });

    describe('does not allow', () => {
      it('for topics to be duplicated', (done) => {
        server
          .post('/api/v1/topics')
          .set('x-access-token', adminToken)
          .send({ title: 'Tech' })
          .expect(409)
          .end((err, res) => {
            res.status.should.equal(409);
            res.body.message.should.equal('A topic exists with that title');
            done();
          });
      });

      it('for topics to be title-less', (done) => {
        server
          .post('/api/v1/topics')
          .set('x-access-token', adminToken)
          .send({})
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('A title is required.');
            done();
          });
      });
    });
  });

  describe('updating', () => {
    describe('does not allow', () => {
      it('for wrong category ids', (done) => {
        server
          .put(`/api/v1/topics/${id}`)
          .set('x-access-token', userToken)
          .send({
            categories: '507f1f77bcf86cd79'
          })
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            done();
          });
      });

      it('for non-existent ids', (done) => {
        server
          .put('/api/v1/topics/507f1f77bcf86cd799439011')
          .set('x-access-token', userToken)
          .expect(404)
          .end((err, res) => {
            res.status.should.equal(404);
            res.body.should.be.type('object');
            res.body.message.should.equal('A topic with that id doesn\'t exist.');
            done();
          });
      });
    });

    describe('allows', () => {
      it('for topics to be updated', (done) => {
        server
          .put(`/api/v1/topics/${id}`)
          .set('x-access-token', userToken)
          .send({
            title: 'Technology',
            content: 'New content',
            categories: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd79']
          })
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.title.should.equal('Technology');
            res.body.content.should.equal('New content');
            done();
          });
      });
    });
  });

  describe('retrieval', () => {
    describe('does not allow', () => {
      it('a non-existent topic to be retrieved', (done) => {
        server
          .get('/api/v1/topics/507f1f77bcf86cd799439011')
          .set('x-access-token', userToken)
          .expect(404)
          .end((err, res) => {
            res.status.should.equal(404);
            res.body.message.should.equal('No topic exists with that id');
            done();
          });
      });
    });

    describe('allows', () => {
      it('for all topics to be retrieved', (done) => {
        server
          .get('/api/v1/topics')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(1);
            done();
          });
      });

      it('for topics to be retrieved with query options', (done) => {
        server
          .get('/api/v1/topics?limit=12&offset=10&order=date')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(0);
            done();
          });
      });

      it('for topics to be retrieved with more query options', (done) => {
        server
          .get('/api/v1/topics?category=50e76f592&order=opinion&skip=5')
          .set('x-access-token', userToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(0);
            done();
          });
      });

      it('for a topic to be retrieved', (done) => {
        server
          .get(`/api/v1/topics/${id}`)
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

  describe('deletion', () => {
    describe('allows', () => {
      it('for topics to be deleted', (done) => {
        server
          .delete(`/api/v1/topics/${id}`)
          .set('x-access-token', adminToken)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.message.should.equal('Topic successfully removed');
            done();
          });
      });
    });
  });

  describe('Opinions', () => {
    before((done) => {
      server
        .post('/api/v1/topics')
        .set('x-access-token', adminToken)
        .send({ title: 'Sports' })
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
            .post(`/api/v1/topics/${topicId}/opinions`)
            .set('x-access-token', userToken)
            .send({ topicId })
            .expect(400)
            .end((err, res) => {
              res.status.should.equal(400);
              res.body.message.should.equal('A title is required.');
              done();
            });
        });
      });

      describe('allows', () => {
        it('for opinions to be created', (done) => {
          server
            .post(`/api/v1/topics/${topicId}/opinions`)
            .set('x-access-token', userToken)
            .send({
              title: 'Good Stuff',
              topicId
            })
            .expect(201)
            .end((err, res) => {
              opinionId = res.body._id;
              res.status.should.equal(201);
              res.body.should.be.type('object');
              res.body.title.should.equal('Good Stuff');
              done();
            });
        });
      });
    });

    describe('updating', () => {
      describe('does not allow', () => {
        it('for updating non-existent opinions', (done) => {
          server
            .put(`/api/v1/topics/${topicId}/opinions/hsiuei`)
            .set('x-access-token', userToken)
            .send({})
            .expect(404)
            .end((err, res) => {
              res.status.should.equal(404);
              res.body.should.be.type('object');
              res.body.message.should.equal('An opinion with that id doesn\'t exist for this topic.');
              done();
            });
        });
      });

      describe('allows', () => {
        it('for opinions to be updated', (done) => {
          server
            .put(`/api/v1/topics/${topicId}/opinions/${opinionId}`)
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
            .get(`/api/v1/topics/${topicId}/opinions/507f1f77bcf86cd799439011`)
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
            .get(`/api/v1/topics/${topicId}/opinions`)
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
            .get(`/api/v1/topics/${topicId}/opinions?limit=12&offset=0`)
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
            .get(`/api/v1/topics/${topicId}/opinions?order=dislikes`)
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
            .get(`/api/v1/topics/${topicId}/opinions?author=uyeughst&order=likes`)
            .expect(200)
            .end((err, res) => {
              res.status.should.equal(200);
              res.body.should.be.type('object');
              res.body.length.should.equal(0);
              done();
            });
        });

        it('for an opinion to be retrieved', (done) => {
          server
            .get(`/api/v1/topics/${topicId}/opinions/${opinionId}`)
            .set('x-access-token', userToken)
            .expect(200)
            .end((err, res) => {
              res.status.should.equal(200);
              res.body.should.be.type('object');
              res.body.should.have.property('isLiked');
              res.body.should.have.property('isDisliked');
              done();
            });
        });
      });
    });

    describe('likes and dislikes', () => {
      describe('allows', () => {
        it('for opinions to be liked', (done) => {
          server
            .put(`/api/v1/topics/${topicId}/opinions/${opinionId}/like`)
            .set('x-access-token', userToken)
            .expect(200)
            .end((err, res) => {
              res.status.should.equal(200);
              res.body.should.be.type('object');
              res.body.likes.number.should.equal(1);
              res.body.likes.users.length.should.equal(1);
              done();
            });
        });

        it('for opinions to be disliked', (done) => {
          server
            .put(`/api/v1/topics/${topicId}/opinions/${opinionId}/dislike`)
            .set('x-access-token', userToken)
            .expect(200)
            .end((err, res) => {
              res.status.should.equal(200);
              res.body.should.be.type('object');
              res.body.dislikes.number.should.equal(1);
              res.body.dislikes.users.length.should.equal(1);
              done();
            });
        });
      });


      describe('does not allow', () => {
        it('for a non-existent opinions to be liked', (done) => {
          server
            .put(`/api/v1/topics/${topicId}/opinions/507f1f77bcf86cd799439011/like`)
            .set('x-access-token', userToken)
            .expect(404)
            .end((err, res) => {
              res.status.should.equal(404);
              res.body.message.should.equal('An opinion with that id doesn\'t exist for this topic.');
              done();
            });
        });

        it('for a non-existent opinions to be disliked', (done) => {
          server
            .put(`/api/v1/topics/${topicId}/opinions/507f1f77bcf86cd799439011/dislike`)
            .set('x-access-token', userToken)
            .expect(404)
            .end((err, res) => {
              res.status.should.equal(404);
              res.body.message.should.equal('An opinion with that id doesn\'t exist for this topic.');
              done();
            });
        });
      });
    });

    describe('unlikes and undislikes', () => {
      describe('allows', () => {
        it('for opinions to be liked', (done) => {
          server
            .delete(`/api/v1/topics/${topicId}/opinions/${opinionId}/like`)
            .set('x-access-token', userToken)
            .expect(200)
            .end((err, res) => {
              res.status.should.equal(200);
              res.body.should.be.type('object');
              res.body.likes.number.should.equal(0);
              res.body.likes.users.length.should.equal(0);
              done();
            });
        });

        it('for opinions to be disliked', (done) => {
          server
            .delete(`/api/v1/topics/${topicId}/opinions/${opinionId}/dislike`)
            .set('x-access-token', userToken)
            .expect(200)
            .end((err, res) => {
              res.status.should.equal(200);
              res.body.should.be.type('object');
              res.body.dislikes.number.should.equal(0);
              res.body.dislikes.users.length.should.equal(0);
              done();
            });
        });
      });


      describe('does not allow', () => {
        it('for a non-existent opinions to be liked', (done) => {
          server
            .delete(`/api/v1/topics/${topicId}/opinions/507f1f77bcf86cd799439011/like`)
            .set('x-access-token', userToken)
            .expect(404)
            .end((err, res) => {
              res.status.should.equal(404);
              res.body.message.should.equal('An opinion with that id doesn\'t exist for this topic.');
              done();
            });
        });

        it('for a non-existent opinions to be disliked', (done) => {
          server
            .delete(`/api/v1/topics/${topicId}/opinions/507f1f77bcf86cd799439011/dislike`)
            .set('x-access-token', userToken)
            .expect(404)
            .end((err, res) => {
              res.status.should.equal(404);
              res.body.message.should.equal('An opinion with that id doesn\'t exist for this topic.');
              done();
            });
        });
      });
    });

    describe('deletion', () => {
      describe('allows', () => {
        it('for opinions to be deleted', (done) => {
          server
            .delete(`/api/v1/topics/${topicId}/opinions/${opinionId}`)
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
});
