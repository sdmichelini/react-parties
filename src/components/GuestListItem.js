import React, { Component } from 'react';

import AuthStore from '../stores/AuthStore';

import GuestActions from '../actions/GuestActions';

require('styles/GuestList.css');


class GuestListItem extends Component {
  constructor() {
    super();
    this.onApprove = this.onApprove.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCheckIn = this.onCheckIn.bind(this);
  }

  onApprove() {
    const { guest } = this.props;
    GuestActions.setGuestStatus(guest.id || guest._id, guest.party_id, 1);
  }

  onDelete() {
    const { guest } = this.props;
    GuestActions.removeGuestFromParty(guest.id || guest._id, guest.party_id);
  }

  onCheckIn() {
    const { guest } = this.props;
    GuestActions.setGuestStatus(guest.id || guest._id, guest.party_id, 2);
  }

  render() {
    const { guest } = this.props;
    const { open } = this.props;
    let style = (guest.male) ? 'guest-list-item male' : 'guest-list-item female';
    let edit_string;
    if(open){
      if(guest.status != 2) {
        edit_string = (<div className='pull-right'>
          <button className='btn btn-success' onClick={ this.onCheckIn }>
            <span className='glyphicon glyphicon-ok' aria-hidden='true'></span>
          </button>
        </div>);
      } else {
        edit_string = (<div className='pull-right'>
          <button className='btn btn-danger' onClick={ this.onApprove }>
            <span className='glyphicon glyphicon-remove' aria-hidden='true'></span>
          </button>
        </div>);
      }

    }
    else if((guest.status == 0) && (AuthStore.isSocial())) {
      edit_string = (<div className='pull-right'>
        <button className='btn btn-danger' onClick={ this.onDelete }>
          <span className='glyphicon glyphicon-remove' aria-hidden='true'></span>
        </button>
        <button className='btn btn-success' onClick={ this.onApprove }>
          <span className='glyphicon glyphicon-ok' aria-hidden='true'></span>
        </button>
      </div>);
    } else if((AuthStore.isSocial()) || (AuthStore.getName() == guest.name)) {
      edit_string = (<div className='pull-right'>
        <button className='btn btn-danger' onClick={ this.onDelete }>
          <span className='glyphicon glyphicon-remove' aria-hidden='true'></span>
        </button>
      </div>);
    }

    return (
      <li className={ style }><span className='guest-name'>{ guest.name }</span> - { guest.added_by } { edit_string }</li>
    );
  }
}

export default GuestListItem;
