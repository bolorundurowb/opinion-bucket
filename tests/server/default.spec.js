/**
 * Created by bolorundurowb on 1/6/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const app = require('./../../server');

const server = supertest.agent(app);

describe('Test', () => {
  it('works', () => {
    server
      .get('/api/v1')
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('hello');
      });
  });
});
