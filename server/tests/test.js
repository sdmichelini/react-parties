'use strict';
const expect = require('chai').expect;
const request = require('superagent');

const MongoClient = require('mongodb').MongoClient;

let guest = require('../models/guest');
let party = require('../models/party');
let bl = require('../models/blackList');

describe('API Test', ()=>{
  const app = require('../application');
  const port = 3001;
  let db;

  let server;
  before((done)=>{
    MongoClient.connect('mongodb://localhost:27017/parties_test', (err, _db)=>{
      if(err) {
        console.error('Could Not Connect to MongoDB');
      }
      guest.initDb(_db);
      party.initDb(_db);
      bl.initDb(_db);
      db = _db;
      server = app.listen(port, done);
    });
  });

  after((done)=>{
    db.dropDatabase((err, result)=>{
      server.close();
      done();
    });
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
  //require('./parties.test');
  require('./guests.test');
  require('./guests.rules.test');
});
