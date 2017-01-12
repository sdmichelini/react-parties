'use strict';

const ObjectId = require('mongodb').ObjectID;

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
  if(id.length != 24) {
    cb('invalid id', undefined);
  } else {
    let obj_id = new ObjectId(id);
    group_collection.findOne({'_id':obj_id}, (err, group) => {
      if(err) {
        cb(err, undefined);
      } else {
        cb(undefined, group);
      }
    });
  }
}

let createGroup = (group, cb) => {
  group_collection.insert(group, (err, result) => {
    if(err) {
      cb(err, undefined);
    } else {
      cb(undefined, group);
    }
  });
}

let updateGroupById = (group, cb) => {
  if(!group || !group._id) {
    cb('no id found', undefined);
  } else if(group._id.length != 24) {
    cb('invalid id', undefined);
  } else {
    let obj_id = new ObjectId(group._id);
    group_collection.update({'_id':obj_id}, {people: group.people, user_id: group.user_id},(err, result) => {
      if(err) {
        cb(err, undefined);
      } else {
        cb(undefined, group);
      }
    });
  }
}

let removeGroupById = (id, cb) => {
  if(id.length != 24) {
    cb('invalid id', undefined);
  } else {
    let obj_id = new ObjectId(id);
    group_collection.remove({'_id':obj_id}, (err, count) => {
      if(err) {
        cb(err, 0);
      } else {
        cb(undefined, count);
      }
    });
  }
}

module.exports = {
  initDb: initDb,
  getGroupById,
  getGroupsByUserId: getGroupsByUserId,
  createGroup: createGroupById,
  updateGroupById: updateGroupById,
  removeGroupById: removeGroupById
}
