import AppDispatcher from '../dispatcher/AppDispatcher';
import BlackListConstants from '../constants/BlackListConstants';
import {URL} from '../constants/UrlConstants';

import BlackListAPI from '../utils/BlackListAPI';

export default {
  getBlackList:() => {
    BlackListAPI
      .getBlackList(URL+'/api/blacklist')
      .then(response => {
        AppDispatcher.dispatch({
          actionType: BlackListConstants.RECIEVE_BLACK_LIST,
          people: response.people
        });
      })
      .catch(response => {
        AppDispatcher.dispatch({
          actionType: BlackListConstants.RECIEVE_BLACK_LIST_ERROR,
          message: response.errors.msg
        });
      });
  },
  addToBlackList:(people, added_by) => {
    BlackListAPI
      .addToBlackList(people, added_by,URL+'/api/blacklist')
      .then(response => {
        AppDispatcher.dispatch({
          actionType: BlackListConstants.ADD_BLACK_LIST,
          people: response.people
        });
      })
      .catch(response => {
        AppDispatcher.dispatch({
          actionType: BlackListConstants.ADD_BLACK_LIST_ERROR,
          message: response.errors.msg
        });
      });
  },
  deleteFromBlackList:(id) => {
    BlackListAPI
      .deleteFromBlackList(URL+'/api/blacklist/'+id)
      .then(response => {
        AppDispatcher.dispatch({
          actionType: BlackListConstants.REMOVE_BLACK_LIST,
          person: response.person
        });
      })
      .catch(response => {
        AppDispatcher.dispatch({
          actionType: BlackListConstants.REMOVE_BLACK_LIST_ERROR,
          message: response.errors.msg
        });
      });
  }
}
