import AppDispatcher from '../dispatcher/AppDispatcher';
import GuestConstants from '../constants/GuestConstants';
import {URL} from '../constants/UrlConstants';

import GuestsAPI from '../utils/GuestsAPI';

export default {

  receiveGuestsById: (id) => {
    GuestsAPI
      .getGuestsById(URL+'/api/guests?party_id='+id)
      .then(response => {
        AppDispatcher.dispatch({
          actionType: GuestConstants.RECIEVE_GUESTS,
          guests: response.guests
        })
      })
      .catch(response => {

        AppDispatcher.dispatch({
          actionType: GuestConstants.RECIEVE_GUESTS_ERROR,
          message: response.errors.msg || 'Error Not Found in API Response.'
        })
      });
  },
  addGuestsToParty: (request) => {
    GuestsAPI
      .addGuestsToParty(URL+'/api/guests', request)
      .then(response => {
        AppDispatcher.dispatch({
          actionType: GuestConstants.ADD_GUESTS,
          guests: response.guests
        });
      })
      .catch(response => {
        AppDispatcher.dispatch({
          actionType: GuestConstants.ADD_GUESTS_ERROR,
          message: response.errors.msg || 'Error Not Found in API Response.'
        });
      });
  },
  setGuestStatus: (id, party_id, status) => {
    GuestsAPI
      .setGuestStatus(URL+'/api/guests', {id: id, party_id: party_id, status: status})
      .then(response => {
        AppDispatcher.dispatch({
          actionType: GuestConstants.UPDATE_GUESTS,
          guest: response.guest
        });
      })
      .catch(response => {
        AppDispatcher.dispatch({
          actionType: GuestConstants.UPDATE_GUESTS_ERROR,
          message: response.errors.msg || 'Error Not Found in API Response.'
        });
      });
  },
  setLocalGuestStatus: (guest) => {
    AppDispatcher.dispatch({
      actionType: GuestConstants.UPDATE_GUESTS,
      guest: guest
    });
  },
  removeGuestFromParty: (id, party_id) => {
    GuestsAPI
      .removeGuestFromParty(URL+'/api/guests/'+id, {party_id: party_id})
      .then(response => {
        AppDispatcher.dispatch({
          actionType: GuestConstants.REMOVE_GUESTS,
          guest: response.guest
        });
      })
      .catch(response => {
        AppDispatcher.dispatch({
          actionType: GuestConstants.REMOVE_GUESTS_ERROR,
          message: response.errors.msg || 'Error Not Found in API Response.'
        });
      });
  }
}
