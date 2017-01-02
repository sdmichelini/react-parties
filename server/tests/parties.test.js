'use strict';
const expect = require('chai').expect;
const request = require('superagent');

describe('Parties test', ()=>{
  let id;
  describe('GET /api/parties',()=>{
    it('should GET /api/parties and return a list of parties', (done)=>{
      request.get('http://localhost:3001/api/parties')
        .end((err, res)=>{
          expect(err).to.not.be.ok;
          expect(res.body).to.have.property('parties');
          expect(res.body.parties).to.be.instanceof(Array);
          expect(res.body.parties.length).to.be.above(0);
          for(let party of res.body.parties) {
            expect(party).to.have.property('name');
            expect(party).to.have.property('id');
            expect(party).to.have.property('date');
            expect(party).to.have.property('type');
            //Get a valid ID for next test
            id = party.id;
          }
          done();
        });
    });
  });
  describe('GET /api/parties/:id',()=>{
    it('should GET /api/parties/:id and return a single party', (done)=>{
      request.get('http://localhost:3001/api/parties/'+id)
        .end((err, res)=>{
          expect(err).to.not.be.ok;
          expect(res.body).to.have.property('party');
          expect(res.body.party).to.have.property('name');
          expect(res.body.party).to.have.property('id');
          expect(res.body.party).to.have.property('date');
          expect(res.body.party).to.have.property('type');

          done();
        });
    });
  });
});
