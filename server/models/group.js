'use strict';

let group_collection;

//Initialze the Database
let initDb = (db) => {
  if (db) {
    group_collection = db.collection('groups');
  } else {
    console.err('Group Collection Received Invalid DB Object.');
  }
}

let getGroupsByUserId = (id, cb) => {
  // No need for initial cache on groups
  group_collection.find({user_id: id}).toArray((err, groups) => {
    if(err) {
      cb(err, undefined);
    } else {
      cb(undefined, groups);
    }
  });
};

let getGroupById = (id, cb) => {
  
}
