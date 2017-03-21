import React, { Component } from 'react';

import AuthStore from '../stores/AuthStore';

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

class LoginRequiredComponent extends Component {

  constructor() {
    super();
  }

  componentWillMount() {
    AuthStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this.onChange);
  }

  onChange() {
      if(AuthStore.isAuthenticated()) {
          document.location = getParameterByName('next');
      }
  }

  render() {
    return (
      <div>
        <h2>Login Required</h2>
        <p className='text-muted'>Please login before proceeding.</p>
      </div>
    );
  }
}

export default LoginRequiredComponent;