'use strict';
const expect = require('chai').expect;
const request = require('superagent');

describe('API Test', ()=>{
  const app = require('../application');
  const port = 3001;

  let server;
  before((done)=>{
    server = app.listen(port, done);
  });

  after((done)=>{
    server.close(done);
  });

  describe('Health Test',()=>{
    it('should GET /api/health w/ Success', (done)=>{
      request.get('http://localhost:3001/api/health')
        .end((err, res)=>{
          expect(err).to.not.be.ok;
          done();
        });
    });
  });
  //Load the Parties Test
  require('./parties.test');
  require('./guests.test');
});
