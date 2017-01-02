import AppDispatcher from '../dispatcher/AppDispatcher';
import PartyConstants from '../constants/PartyConstants';

import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let _parties = [];

function setParties(parties) {
  _parties = parties;
}

function addParty(party) {
  _parties.push(party);
}

function removeParty(party) {
  _parties = _parties.filter((_party) => {
    return (_party._id != party.id);
  });
}

function updateParty(party) {
  for(let i = 0; i < _parties.length; i++) {
    if(_parties[i]._id == party._id) {
      _parties[i].status = party.status;
      break;
    }
  }
}

class PartyStoreClass extends EventEmitter {
  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getParties() {
    return _parties;
  }

  getPartyById(id) {
    for (let party of _parties) {
      if((party.id === id)||(party._id === id)) {
        return party;
      }
    }
    return undefined;
  }
}

const PartyStore = new PartyStoreClass();

PartyStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.actionType) {
    case PartyConstants.RECIEVE_PARTIES:
    {
        if(action.parties) {
          setParties(action.parties);
          PartyStore.emitChange();
        }
        break;
    }
    case PartyConstants.RECIEVE_PARTIES_ERROR:
    {
      alert(action.message);

      break;
    }

    case PartyConstants.RECIEVE_PARTY:
    {
      if(action.party) {
        addParty(action.party);
        PartyStore.emitChange();
      }
      break;
    }

    case PartyConstants.RECIEVE_PARTY_ERROR:
    {
      alert(action.message);

      break;
    }

    case PartyConstants.CREATE_PARTY:
    {
      if(action.party) {
        addParty(action.party);
        PartyStore.emitChange();
      }
      break;
    }

    case PartyConstants.CREATE_PARTY_ERROR:
    {
      alert(action.message);

      break;
    }

    case PartyConstants.DELETE_PARTY:
    {
      if(action.party) {
        removeParty(action.party);
        PartyStore.emitChange();
      }
      break;
    }

    case PartyConstants.DELETE_PARTY_ERROR:
    {
      alert(action.message);

      break;
    }

    case PartyConstants.UPDATE_PARTY:
    {
      if(action.party) {
        updateParty(action.party);
        PartyStore.emitChange();
      }
      break;
    }


    default:
      break;
  }
});

export default PartyStore;
