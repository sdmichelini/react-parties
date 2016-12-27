import React, { Component } from 'react';

import { Link } from 'react-router';

//We need to know if we are logged in or not
import AuthStore from '../stores/AuthStore';

class IndexComponent extends Component {

  constructor() {
    super();
    this.state = {
      authenticated: AuthStore.isAuthenticated()
    };
    this.onAuthChange = this.onAuthChange.bind(this);
  }

  componentWillMount() {
    AuthStore.addChangeListener(this.onAuthChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this.onAuthChange);
  }


  onAuthChange() {
    this.setState({
      authenticated: AuthStore.isAuthenticated()
    });
  }

  render() {
    let enterLink = (<p>You are not authenticated</p>);
    if(this.state.authenticated) {
      enterLink = (
        <Link to={'/parties'}>View Parties.</Link>
      )
    }
    return (
      <div>
        <h2>Welcome to the party system.</h2>
        { enterLink }
      </div>
    );
  }
}

export default IndexComponent;
