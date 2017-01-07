"use strict";

const ObjectId = require('mongodb').ObjectID;

let PARTIES = [];

let NEED_PARTIES_UPDATE = false;

let party_collection;

const guest_model = require('./guest');

//Initialze the Database
let initDb = (db) => {
  if (db) {
    party_collection = db.collection('parties');
    initCache();
  } else {
    console.error('Parties Collection Received Invalid DB Object.');
  }
}

function initCache() {
  party_collection.find().toArray((err, parties) => {
    if (err) {
      return console.err('Failed to initialize parties cache w/ err: '+err);
    }
    // Add all items to GUESTS
    PARTIES = PARTIES.concat(parties);
  });
}

let forcePartyLoad = (cb) => {
  party_collection.find().toArray((err, parties) => {
    if(err) {
      cb(err, undefined);
      return console.error('Error Accessing Parties');
    }
    cb(undefined, parties);
  });
}

let getParties = (cb) => {
  if(NEED_PARTIES_UPDATE) {
    party_collection.find().toArray((err, parties) => {
      if(err) {
        cb(err, undefined);
        return console.err('Error Accessing Parties');
      }
      PARTIES = parties;
      NEED_PARTIES_UPDATE = false;
      cb(undefined, PARTIES);
    });
  } else {
    cb(undefined, PARTIES);
  }
}

let getPartyById = (id, cb) => {
  if(id.length != 24) {
    cb('invalid party id', undefined);
    return;
  } else if (NEED_PARTIES_UPDATE){
    console.log('Database Hit');
    id = new ObjectId(id);
    party_collection.findOne({'_id':id}, (err, party) => {
      if(err) {
        cb(err, undefined);
        return console.err('Error Accessing Party');
      }
      cb(undefined, party);
    });
  } else {
    let party = PARTIES.filter((party)=>{
      return party._id == id;
    });
    if(party) {
      cb(undefined, party[0]);
    } else {
      cb(undefined, undefined);
    }
  }
}

let createParty = (data, cb) => {
  party_collection.insert(data, (err, result) => {
    if(err) {
      console.err('Error Creating Party');
      cb(err, undefined);
      return;
    } else {
      PARTIES.push(data);
      cb(undefined, data);
    }
  });
}

// Delete the Party and Remove all Guests Associated w/ it
let deleteParty = (id, cb) => {
  if(id.length != 24) {
    cb('id not valid', undefined);
  } else {
    let obj_id = new ObjectId(id);
    party_collection.remove({_id:obj_id}, (err, count) => {
      if(err) {
        cb(err, undefined);
        return console.err('Error Deleting Party');
      }
      let party;
      for(let i = 0; i < PARTIES.length; i++) {
        if(PARTIES[i]._id == id) {
          party = PARTIES.splice(i, 1);
          break;
        }
      }
      if(party) {
        party = party[0];
        //Remove All Guests from Party
        guest_model.removeAllGuestsFromParty(party._id, (err) => {
          if(err) {
            cb(err, undefined);
          } else {
            cb(undefined, party);
          }
        });
      } else {
        cb(undefined, undefined);
      }
    });
  }
}

let updateParty = (id, status, cb) => {
  if(id.length != 24) {
    cb('id not valid', undefined);
  } else {
    let obj_id = new ObjectId(id);
    party_collection.update({_id: obj_id}, {$set: {status: status}}, (err, result) => {
      if(err) {
        cb(err, undefined);
        return console.error('DB Error');
      } else {
        let party;
        for(let i = 0; i < PARTIES.length; i++){
          if(PARTIES[i]._id == id) {
            PARTIES[i].status = status;
            party = PARTIES[i];
            break;
          }
        }
        cb(undefined, party);
      }
    });
  }
}

let getPartyByIdPromise = (id) => {
  console.log('getting party id');
  return new Promise((resolve, reject) => {
    getPartyById(id, (err, party)=>{
      if(err) {
        reject(err);
      } else {
        resolve(party);
      }
    });
  });
}

module.exports = {
  initDb: initDb,
  getParties: getParties,
  getPartyById: getPartyById,
  getPartyByIdPromise: getPartyByIdPromise,
  createParty: createParty,
  deleteParty: deleteParty,
  updateParty: updateParty,
  forcePartyLoad: forcePartyLoad
}
