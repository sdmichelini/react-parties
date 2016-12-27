require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/PartyList.css');

import React from 'react';

import PartyActions from '../actions/PartyActions';
import PartyStore from '../stores/PartyStore';

import AuthStore from '../stores/AuthStore';

import { Link } from 'react-router';

class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      parties: []
    }
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    PartyStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    PartyActions.receiveParties();
  }

  componentWillUnmount() {
    PartyStore.removeChangeListener(this.onChange);
  }

  deleteParty(id) {
    let r = confirm('Really Delete Party?');
    if(r == true) {
      PartyActions.deleteParty(id);
    }
  }

  onChange() {
    this.setState({
      parties: PartyStore.getParties()
    });
  }

  render() {
    let parties = this.state.parties.map(party =>
      (<li key={ party.id || party._id } className='party-list-item'>
        <Link to={ `/parties/${party.id||party._id}` }>
          { party.name }
        </Link>
        <div className='pull-right'>
          <button className='btn btn-danger' onClick={this.deleteParty.bind(this, party._id)}>Delete</button>
        </div>
      </li>)
    );
    let link;
    if(AuthStore.isSocial()) {
      link = (<Link to={'/create/party'}>
        <span className='glyphicon glyphicon-plus' aria-hidden='true'></span>
      </Link>);
    }
    return (
      <div>
        <h1>Parties { link }</h1>
        <p className='text-muted'>
          Welcome to the Parties Site. Click below on a party to add people.
        </p>
        <ul className='party-list'>
          { parties }

        </ul>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
