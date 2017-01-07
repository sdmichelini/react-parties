'use strict';

let black_list_collection;

const ObjectId = require('mongodb').ObjectID;

let BLACK_LIST = [];

//Initialze the Database
let initDb = (db) => {
  if (db) {
    black_list_collection = db.collection('blacklist');
  } else {
    console.err('Black List Collection Received Invalid DB Object.');
  }
}

// Pass in the callback object
// cb(Error, Array of People)
let getBlackList = (cb) => {
  black_list_collection.find().toArray((err, people) => {
    if(err) {
      cb(err, undefined);
      return console.error('DB Error w/ Black List');
    }
    BLACK_LIST = people;
    cb(undefined, people);
  });
}

let addToBlackList = (people, cb) => {
  black_list_collection.insert(people, (err, result) => {
    if(err) {
      cb(err, undefined);
      return console.error('DB Error Adding People to BlackList');
    } else {
      BLACK_LIST = BLACK_LIST.concat(people);
      cb(undefined, people);
    }
  });
}

let removePersonFromBlacklist = (id, cb) => {
  if(id.length != 24) {
    cb('invalid id', undefined);
  } else {
    let obj_id = new ObjectId(id);
    black_list_collection.remove({_id:obj_id}, (err, count)=> {
      if(err) {
        cb(err, undefined);
        return console.error('DB Error Removing Person from BlackList');
      } else {
        let guest;
        for(let i = 0; i < BLACK_LIST.length; i++) {
          if((BLACK_LIST[i]._id == id)){
            guest = BLACK_LIST.splice(i, 1);
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

module.exports = {
  initDb: initDb,
  getBlackList: getBlackList,
  addToBlackList: addToBlackList,
  removePersonFromBlacklist: removePersonFromBlacklist
}
