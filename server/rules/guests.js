'use strict';

const constants = require('../constants/constants');

//Guest status rules

// If there is too many invites
let applyGuestStatus = (guest, cur_guests, cur_party) => {
  switch(cur_party.type) {
    case constants.PARTY: {
      // Only count male guests that are already on the list
      let number_guests = cur_guests
        .filter((_guest) => {
          return (_guest.added_by == guest.added_by)&&(_guest.status != constants.STATUS_AWAITING_APPROVAL)&&(_guest.male);
        })
        .length;
      console.log(number_guests);
      if(number_guests < 3) {
        guest.status = constants.STATUS_ON_LIST;
      }
      if(!guest.male) {
        guest.status = constants.STATUS_ON_LIST;
      }
      break;
    }
    case constants.SOCIAL: {
      // Only count male guests that are already on the list
      let number_guests = cur_guests
        .filter((_guest) => {
          return (_guest.added_by == guest.added_by)&&(_guest.status != constants.STATUS_AWAITING_APPROVAL);
        })
        .length;
      if(number_guests < 3) {
        guest.status = constants.STATUS_ON_LIST;
      }
      break;
    }
    case constants.SOCIAL_MODERATED: {
      break;
    }
  }
  console.log(guest);
  if(guest.status == undefined) {
    guest.status = constants.STATUS_AWAITING_APPROVAL;
  }

  return guest;
};

module.exports = {
  applyGuestStatus: applyGuestStatus
}
