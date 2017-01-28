'use strict';
/*
 Permissions Module
*/

const PERMISSIONS = {
  addGuest: ['party-user'],
  // Edit the list and open/close the party
  editParty: ['social'],
  // Create a Party
  createParty: ['social', 'president'],
  // View Blacklist
  viewBlacklist: ['social'],
  // Edit Blacklist
  editBlacklist: ['president']
}

function hasPermission(permission, roles) {
  if(!roles || !permission) {
    return false;
  } else {
    for(var i = 0;  i < permission.length; i++) {
      for(var j = 0; j < roles.length; j++) {
        if(permission[i] == roles[j]) {
          return true;
        } else if(roles[j] == 'admin') {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports = {
  PERMISSIONS: PERMISSIONS,
  hasPermission: hasPermission
}
