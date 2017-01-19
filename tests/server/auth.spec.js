/**
 * Created by bolorundurowb on 1/19/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const app = require('./../../server');

const server = supertest.agent(app);

describe('Auth', () => {
  // Creation Tests
  it('allows for categories to be created', (done) => {
    server
      .post('/api/v1/auth/signout')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.should.be.type('object');
        res.body.message.should.equal('signout successful');
        done();
      });
  });
});
