"use strict";

const ObjectId = require('mongodb').ObjectID;

const constants = require('../constants/constants');


//This file is responsible for the cache along with database access and keeping the two in sync

// Database Variables
let guest_collection;

// Cache of all guests
// This should be okay if we only have one instance running at a time
let GUESTS = [];

//Does the cache need updating?
let NEED_UPDATE = false;

//Initialze the Database
let initDb = (db) => {
  if (db) {
    guest_collection = db.collection('guests');
    initCache();
  } else {
    console.err('Guest Collection Received Invalid DB Object.');
  }
}

function initCache() {
  guest_collection.find().toArray((err, guests) => {
    if (err) {
      return console.err('Failed to initialize guests cache w/ err: '+err);
    }
    // Add all items to GUESTS
    GUESTS = GUESTS.concat(guests);
  });
}

/*
  Get's the guests for a given party id

Params:
  party_id: ID for given party
  cb: Callback function to be called with (error, guests)
*/
let getGuestsForParty = (party_id, cb) => {
  //Convert Party ID to object ID
  if(party_id.length != 24) {
    cb('invalid party_id', undefined);
    return;
  } else if(NEED_UPDATE) {
    party_id = new ObjectId(party_id);
    guest_collection.find({'party_id':party_id}, (err, guests) => {
      if(err) {

        cb(err, undefined);
      } else {
        // Replace all the guests with not same party id
        // We do this because we are certain that all guests with party_id are in guests object
        let old_guests = GUESTS;
        GUESTS = [];
        for (let old_guest of old_guests) {
          if(old_guest.party_id != party_id) {
            GUESTS.push(old_guest);
          }
        }
        GUESTS = GUESTS.concat(guests);
        NEED_UPDATE = false;
        cb(undefined, guests);
      }
    });
  } else {
    let guests = GUESTS.filter((guest)=>{
      return guest.party_id == party_id;
    });
    cb(undefined, guests);
  }
}

let addGuestsToParty = (guests, cb) => {

  guest_collection.insert(guests, (err, result) => {
    if(err) {
      cb(err, undefined);
      return console.err('DB Error Adding Guests to Party');
    } else {
      GUESTS = GUESTS.concat(guests);
      cb(undefined, guests);
      NEED_UPDATE = false;
    }
  });
}

let updateGuestForParty = (id, status, cb) => {
  if (id.length != 24) {
    cb('invalid id', undefined);
  } else {
    let obj_id = new ObjectId(id);
    let updatedObj = {status: status};
    // Log when they are checked in
    if(status == constants.STATUS_CHECKED_IN) {
      updatedObj = {status: status, checked_in: Date.now()};
    }
    guest_collection.update({_id:obj_id}, {$set: updatedObj}, (err, count, result) => {
      if(err) {
        cb(err, undefined);
        return console.error('DB Error Updating Guest for Party');
      } else {
        let guest;
        //Update the cache
        for(let i = 0; i < GUESTS.length; i++){
          if(GUESTS[i]._id == id) {
            GUESTS[i].status = status;
            guest = GUESTS[i];
            break;
          }
        }
        cb(undefined, guest);
      }
    });
  }
}

let removeGuestFromParty = (id, cb) => {
  if(id.length != 24) {
    cb('invalid id', undefined);
  } else {
    let obj_id = new ObjectId(id);
    guest_collection.remove({_id:obj_id}, (err, count)=> {
      if(err) {
        cb(err, undefined);
        return console.err('DB Error Updating Guest for Party');
      } else {
        let guest;
        for(let i = 0; i < GUESTS.length; i++) {
          if((GUESTS[i]._id == id)){
            guest = GUESTS.splice(i, 1);
          }
        }
        if(guest) {
          cb(undefined, guest[0]);
        } else {
          cb(undefined, undefined);
        }

      }
    });
  }
}

let removeAllGuestsFromParty = (id, cb) => {
  if(id.length != 24) {
    cb('invalid id');
  } else {
    guest_collection.remove({party_id: id}, (err, count) => {
      if(err) {
        cb(err);
      } else {
        GUESTS = GUESTS.filter((guest) => {
          return guest.party_id != id;
        });
        cb(undefined);
      }
    });
  }
}

module.exports = {
  initDb: initDb,
  getGuestsForParty: getGuestsForParty,
  addGuestsToParty: addGuestsToParty,
  updateGuestForParty: updateGuestForParty,
  removeGuestFromParty: removeGuestFromParty,
  removeAllGuestsFromParty: removeAllGuestsFromParty
}
