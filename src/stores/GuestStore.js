import AppDispatcher from '../dispatcher/AppDispatcher';
import GuestConstants from '../constants/GuestConstants';

import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let _guests = [];

function setGuests(guests) {
  _guests = guests;
}

function addGuests(guests) {
  for(let guest of guests) {
    _guests.push(guest);
  }
}

function removeGuest(guest) {
  let len = _guests.length;
  for(let i = 0; i < len; i++){
    if(_guests[i]._id == guest._id){
      _guests.splice(i,1);
      break;
    }
  }
}

function updateGuest(new_guest) {
  for(let i = 0; i < _guests.length; i++){
    if((new_guest._id == _guests[i]._id)){
      _guests[i] = new_guest;
      break;
    }
  }
}


class GuestStoreClass extends EventEmitter {
  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getGuests() {
    return _guests;
  }

}

const GuestStore = new GuestStoreClass();

GuestStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.actionType) {
    case GuestConstants.RECIEVE_GUESTS:
    {
        if(action.guests) {
          setGuests(action.guests);
          GuestStore.emitChange();
        }
        break;
    }
    case GuestConstants.RECIEVE_GUESTS_ERROR:
    {
      alert(action.message);

      break;
    }
    case GuestConstants.ADD_GUESTS:
    {
      if(action.guests) {
        addGuests(action.guests);
        GuestStore.emitChange();
      }
      break;
    }

    case GuestConstants.ADD_GUESTS_ERROR:
    {
      alert(action.message);
      break;
    }

    case GuestConstants.UPDATE_GUESTS:
    {
      if(action.guest) {
        updateGuest(action.guest);
        GuestStore.emitChange();
      }
      break;
    }

    case GuestConstants.UPDATE_GUESTS_ERROR:
    {
      alert(action.message);
      break;
    }

    case GuestConstants.REMOVE_GUESTS:
    {
      if(action.guest) {
        removeGuest(action.guest);
        GuestStore.emitChange();
      }
      break;
    }

    case GuestConstants.REMOVE_GUESTS_ERROR:
    {
      alert(action.message);
      break;
    }


    default:
      break;
  }
});

export default GuestStore;
