'use strict';
const expect = require('chai').expect;
const request = require('superagent');

describe('Guests test', ()=>{

  describe('GET /api/guests/:party_id',()=>{
    it('should GET /api/guests/:id and return a single party', (done)=>{
      request.get('http://localhost:3001/api/guests/1')
        .end((err, res)=>{
          expect(err).to.not.be.ok;
          expect(res.body).to.have.property('guests');

          done();
        });
    });
  });
});
