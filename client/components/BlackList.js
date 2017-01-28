import React, { Component } from 'react';

import BlackListStore from '../stores/BlackListStore';

import BlackListActions from '../actions/BlackListActions';

import BlackListAddComponent from './BlackListAdd';
import BlackListItemComponent from './BlackListItem';

import permissions from '../../common/permission'
import AuthStore from '../stores/AuthStore'

class BlackListComponent extends Component {

  constructor() {
    super();
    this.state = {
      people: []
    }
  }

  componentWillMount() {
    BlackListStore.addChangeListener(this.onBlackListChange.bind(this));
  }

  componentDidMount() {
    BlackListActions.getBlackList();
  }

  componentWillUnmount() {
    BlackListStore.removeChangeListener(this.onBlackListChange.bind(this));
  }

  onBlackListChange() {
    let people = BlackListStore.getPeople();
    this.setState({
      people: people
    });
  }

  render() {
    let people_string = JSON.stringify(this.state.people);
    let people_components = this.state.people.map((person) =>
      <BlackListItemComponent key={person._id} guest={person} />
    );
    let black_list_add = (AuthStore.hasPermission(permissions.PERMISSIONS.editBlacklist)) ?
      (<BlackListAddComponent />) : (<p>You do not have permission to edit the blacklist. You must be the president to do so. </p>);
    return (
      <div>
        <h1>Black List</h1>
        <p className='text-muted'>{'This is the blacklist.'}</p>
        { black_list_add }
        <ul className='guest-list'>
          { people_components }
        </ul>
      </div>
    );
  }
}

export default BlackListComponent;
