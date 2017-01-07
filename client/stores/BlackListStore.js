import AppDispatcher from '../dispatcher/AppDispatcher';
import BlackListConstants from '../constants/BlackListConstants';

import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let _people = [];

function setPeople(people) {
  _people = people;
}

function addPeople(people) {
  for(let person of people) {
    _people.push(person);
  }
}

function removePerson(person) {
  let len = _people.length;
  for(let i = 0; i < len; i++){
    if(_people[i]._id == person._id){
      _people.splice(i,1);
      break;
    }
  }
}

class BlackListStoreClass extends EventEmitter {
  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getPeople() {
    return _people;
  }

}

const BlackListStore = new BlackListStoreClass();

BlackListStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.actionType) {
    case BlackListConstants.RECIEVE_BLACK_LIST:
    {
        if(action.people) {
          setPeople(action.people);
          BlackListStore.emitChange();
        }
        break;
    }
    case BlackListConstants.RECIEVE_BLACK_LIST:
    {
      alert(action.message);

      break;
    }
    case BlackListConstants.ADD_BLACK_LIST:
    {
      if(action.people) {
        addPeople(action.people);
        BlackListStore.emitChange();
      }
      break;
    }

    case BlackListConstants.ADD_BLACK_LIST_ERROR:
    {
      alert(action.message);
      break;
    }


    case BlackListConstants.REMOVE_BLACK_LIST:
    {
      if(action.person) {
        removePerson(action.person);
        BlackListStore.emitChange();
      }
      break;
    }

    case BlackListConstants.REMOVE_BLACK_LIST_ERROR:
    {
      alert(action.message);
      break;
    }


    default:
      break;
  }
});

export default BlackListStore;
