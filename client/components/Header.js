import React, { Component } from 'react';
import { Link } from 'react-router';

import AuthActions from '../actions/AuthActions';
import AuthStore from '../stores/AuthStore';

import features from '../../common/features';

require('styles/Nav.css');

class HeaderComponent extends Component {

  constructor() {
    super();
    this.state = {
      authenticated: AuthStore.isAuthenticated(),
      admin: AuthStore.isAdmin()
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  login() {
    if(!features.isDevelopment() && location.protocol != 'https:') {
      alert('WARNING: You must be using a https connection to log-in. Please go to the https version of this site. Log-in attempt failed.');
      return;
    }
    this.props.lock.show((err, profile, token) => {
      if (err) {
        alert(err);
        return;
      }
      AuthActions.logUserIn(profile, token);

    });
  }

  logout() {
    AuthActions.logUserOut();
    this.setState({authenticated: false});
  }

  componentWillMount() {
    AuthStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({authenticated: AuthStore.isAuthenticated(),
    admin: AuthStore.isSocial()});
  }

  render() {
    let content;
    let link = '/';
    let groupsEnabled = features.isFeatureEnabled('groups');
    if(this.state.authenticated && this.state.admin && groupsEnabled) {
      content = (
        <ul className='nav navbar-nav navbar-red-nav'>
          <li role='presentation'><a onClick={this.logout} href='#'>Logout</a></li>
          <li role='presentation'><Link to={'/dashboard'}>Dashboard</Link></li>
          <li role='presentation'><Link to={'/groups'}>Groups</Link></li>
        </ul>
      );
      link = '/parties';
    } else if(this.state.authenticated && this.state.admin){
      content = (
        <ul className='nav navbar-nav navbar-red-nav'>
          <li role='presentation'><a onClick={this.logout} href='#'>Logout</a></li>
          <li role='presentation'><Link to={'/dashboard'}>Dashboard</Link></li>
        </ul>
      );
      link = '/parties';
    } else if(this.state.authenticated && groupsEnabled) {
      content = (
        <ul className='nav navbar-nav navbar-red-nav'>
          <li role='presentation'><a onClick={this.logout}>Logout</a></li>
          <li role='presentation'><Link to={'/groups'}>Groups</Link></li>
        </ul>
      );
      link = '/parties';
    } else if(this.state.authenticated) {
      content = (
        <ul className='nav navbar-nav navbar-red-nav'>
          <li role='presentation'><a onClick={this.logout}>Logout</a></li>
        </ul>
      );
      link = '/parties';
    } else {
        content = (
          <ul className='nav navbar-nav navbar-red-nav'>
            <li role='presentation'><a onClick={this.login}>Login</a></li>
          </ul>
        );
    }
    return (
      <nav className='navbar navbar-default navbar-red'>
        <div className='container-fluid'>
          <div className='navbar-header navbar-red-header'>
            <Link className='navbar-brand' to={ link }>Parties</Link>
          </div>
          { content }
        </div>
      </nav>
    );

    /*(
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={ link }>Parties</Link>
          </Navbar.Brand>
        </Navbar.Header>
        {content}
      </Navbar>
    );*/
  }
}

export default HeaderComponent;
