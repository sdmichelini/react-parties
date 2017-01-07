'use strict';
const expect = require('chai').expect;
const request = require('superagent');

const party_model = require('../models/party');
const guest_model = require('../models/guest');

const jsonwebtoken = require('jsonwebtoken');

const jwt = jsonwebtoken.sign({
  sub: 'auth0|5813aac8f1413bed0950e513'
}, new Buffer(process.env.AUTH0_SECRET, 'base64'), {audience: process.env.AUTH0_CLIENT_ID});

let cur_guests = [
  {name:'Jim', status: 0, added_by: 'Rick', male:true},
  {name:'Jim', status: 1, added_by: 'Bob',male:true},
  {name:'Jim', status: 1, added_by: 'Bob',male:true},
  {name:'Jim', status: 1, added_by: 'Bob',male:true},
  {name:'Jim', status: 0, added_by: 'Bob',male:true},
  {name:'Jim', status: 0, added_by: 'Bob',male:true},
  {name:'Jim', status: 0, added_by: 'Bob',male:true}
];

describe('Guests test', ()=>{
  let test_party_id = undefined;
  before((done) => {
    // Add in a party
    let test_party = {name: 'My Test Party', type: 0, when: Date.now()};
    party_model.createParty(test_party,(err, party)=>{
      if(err) {
        console.error(err);
      } else {
        for(let guest of cur_guests) {
          guest.party_id = party._id;
        }
        guest_model.addGuestsToParty(cur_guests, (err, guests)=>{
          if(err) {
            console.error(err);
          } else {
            test_party_id = party._id;
            done();
          }
        });
      }
    });
  });
  describe('GET /api/guests/',()=>{
    it('should GET /api/guests and return all guests', (done)=>{
      request.get('http://localhost:3001/api/guests/?party_id='+test_party_id)
        .set('Authorization','Bearer '+jwt)
        .end((err, res)=>{
          expect(res.status).to.equal(200);
          expect(err).to.not.be.ok;
          expect(res.body).to.have.property('guests');
          expect(res.body.guests.length).to.least(7);
          done();
        });
    });
  });
  describe('POST /api/guests', ()=> {
    it('should AUTO_APPROVE if not 3 guests yet', (done)=>{
      request.post('http://localhost:3001/api/guests/')
        .type('json')
        .send({
                guests:[
                  {name:'Jim', added_by: 'Bob',male:true}
                ],
                added_by: 'Jim',
                party_id: test_party_id
              })
        .set('Authorization','Bearer '+jwt)
        .end((err, res)=>{
          expect(res.status).to.equal(201);
          expect(err).to.not.be.ok;
          expect(res.body).to.have.property('guests');
          expect(res.body.guests.length).to.equal(1);
          expect(res.body.guests[0].status).to.equal(1);
          done();
        });
    });
    it('should not AUTO_APPROVE if there are 3 guests yet', (done)=>{
      request.post('http://localhost:3001/api/guests/')
        .type('json')
        .send({
                guests:[
                  {name:'Jim', male:true}
                ],
                added_by: 'Bob',
                party_id: test_party_id
              })
        .set('Authorization','Bearer '+jwt)
        .end((err, res)=>{
          expect(res.status).to.equal(201);
          expect(err).to.not.be.ok;
          expect(res.body).to.have.property('guests');
          expect(res.body.guests.length).to.equal(1);
          expect(res.body.guests[0].status).to.equal(0);
          done();
        });
    });
  });
});
