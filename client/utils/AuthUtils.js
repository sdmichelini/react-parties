import AuthStore from '../stores/AuthStore';

export default {
  requireAuth: (nextState, replace) => {
    if (!AuthStore.isUser()) {
      // If we are already logged in, the user is unauthorized
      if(AuthStore.isAuthenticated()) {
        replace({
          pathname: '/notAuthorized'
        });
      } else {
        replace({
          pathname: '/loginRequired'
        });
        document.location = '/loginRequired?next='+nextState.location.pathname;
      }
    }
  },
  requireAdmin: (nextState, replace) => {
    if (!AuthStore.isSocial()) {
      // If we are already logged in, the user is unauthorized
      if(AuthStore.isAuthenticated()) {
        replace({
          pathname: '/notAuthorized'
        });
      } else {
        replace({
          pathname: '/loginRequired'
        });
        document.location = '/loginRequired?next='+nextState.location.pathname;
      }
    }
  }
}
