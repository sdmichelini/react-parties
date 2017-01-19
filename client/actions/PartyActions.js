import AppDispatcher from '../dispatcher/AppDispatcher';
import PartyConstants from '../constants/PartyConstants';
import {URL} from '../constants/UrlConstants';

import PartiesAPI from '../utils/PartiesAPI';

export default {
  receiveParties: () => {
    PartiesAPI
      .getParties(URL+'/api/parties')
      .then(response => {
        AppDispatcher.dispatch({
          actionType: PartyConstants.RECIEVE_PARTIES,
          parties: response.parties
        })
      })
      .catch(response => {
        AppDispatcher.dispatch({
          actionType: PartyConstants.RECIEVE_PARTIES_ERROR,
          message: response.errors.msg || 'Error Not Found in API Response.'
        })
      });
  },
  receivePartyById: (id) => {
    PartiesAPI
      .getPartyById(URL+'/api/parties/'+id)
      .then(response => {
        console.log(response);
        AppDispatcher.dispatch({
          actionType: PartyConstants.RECIEVE_PARTY,
          party: response.party
        });
      })
      .catch(response => {
        console.log(response);
        AppDispatcher.dispatch({
          actionType: PartyConstants.RECIEVE_PARTY_ERROR,
          message: response.errors.msg || 'Error Not Found in API Response.'
        });
      });
  },
  createParty: (data) => {
    PartiesAPI
      .createParty(URL+'/api/parties', {party: data})
      .then(response => {
        AppDispatcher.dispatch({
          actionType: PartyConstants.CREATE_PARTY,
          party: response.party
        });
      })
      .catch(response => {
        AppDispatcher.dispatch({
          actionType: PartyConstants.CREATE_PARTY_ERROR,
          message: response.errors.msg || 'Error Not Found in API Response.'
        });
      });
  },
  deleteParty: (id) => {
    PartiesAPI
      .deleteParty(URL+'/api/parties/'+id)
      .then(response => {
        AppDispatcher.dispatch({
          actionType: PartyConstants.DELETE_PARTY,
          party: response.party
        });
      })
      .catch(response => {
        AppDispatcher.dispatch({
          actionType: PartyConstants.DELETE_PARTY_ERROR,
          message: response.errors.msg || 'Error Not Found in API Response.'
        });
      });
  },
  updateParty: (id, status) => {
    PartiesAPI
      .updateParty(URL+'/api/parties/'+id, status)
      .then(response => {
        AppDispatcher.dispatch({
          actionType: PartyConstants.UPDATE_PARTY,
          party: response.party
        });
      })
      .catch(response => {
        AppDispatcher.dispatch({
          actionType: PartyConstants.UPDATE_PARTY_ERROR,
          message: response.errors.msg || 'Error Not Found in API Response.'
        });
      });
  }
}
