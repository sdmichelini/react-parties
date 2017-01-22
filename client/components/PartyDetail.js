require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/GuestList.css')

import React from 'react';

import GuestActions from '../actions/GuestActions';
import GuestStore from '../stores/GuestStore';

import PartyActions from '../actions/PartyActions';
import PartyStore from '../stores/PartyStore';

import AuthStore from '../stores/AuthStore';

import GuestUtils from '../utils/GuestUtils';

import GuestListItem from './GuestListItem';

import {WS_URL} from '../constants/UrlConstants';

function getGuestListItem2(guest, open) {
  let ret = (
    <GuestListItem
      key={guest.id || guest._id}
      open = {open}
      guest={guest}
    />
  );
  return ret;
}

function guestSortCompare(guest1, guest2) {
  let guest1_names = guest1.name.split(' ');
  let guest1_last_name = guest1_names[guest1_names.length - 1].toLowerCase();

  let guest2_names = guest2.name.split(' ');
  let guest2_last_name = guest2_names[guest2_names.length - 1].toLowerCase();

  if(guest1_last_name < guest2_last_name) {
    return -1;
  } else if(guest1_last_name > guest2_last_name) {
    return 1;
  } else {
    return 0;
  }
}

let ws;

class PartyDetailComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      party: {},
      male_guests: [],
      female_guests: [],
      unapproved_males: [],
      unapproved_females: [],
      search_filter: ''
    }
    this.onPartyChange = this.onPartyChange.bind(this);
    this.onGuestChange = this.onGuestChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.onMaleAdd = this.onGuestAdd.bind(this, true);
    this.onFemaleAdd = this.onGuestAdd.bind(this, false);
    this.cleanUp = this.cleanUp.bind(this);
    this.onEvent = this.onEvent.bind(this);
  }

  onEvent(e) {
    //console.log(e.data);
  }

  cleanUp() {
    if(ws) {
      ws.close();
      ws = undefined;
    }
  }

  componentWillMount() {
    PartyStore.addChangeListener(this.onPartyChange);
    GuestStore.addChangeListener(this.onGuestChange);
  }

  componentDidMount() {
    //First try to find party
    let party = PartyStore.getPartyById(this.props.params.id);
    if(!party) {
      PartyActions.receivePartyById(this.props.params.id);
    } else {
      this.setState({
        party: party
      });
    }
    GuestActions.receiveGuestsById(this.props.params.id);

  }

  componentWillUnmount() {
    PartyStore.removeChangeListener(this.onPartyChange);
    GuestStore.removeChangeListener(this.onGuestChange);
    this.cleanUp();
  }

  onPartyChange() {
    let party = PartyStore.getPartyById(this.props.params.id);
    if(party.status && (party.status==1)) {
      //Open Party
      ws = new WebSocket(WS_URL);
      ws.onmessage = (e) => {
        if(e.data) {
          let guest = JSON.parse(e.data);
          console.log(guest);
          if(guest && guest.status) {
            GuestActions.setLocalGuestStatus(guest);
          }
        }
      };
    } else if(ws) {
      this.cleanUp();
    }
    this.setState({
      party: party
    });
  }

  onGuestChange() {
    let male_guests = [];
    let female_guests = [];
    let un_male_guests = [];
    let un_female_guests = [];
    let guests = GuestStore.getGuests().sort(guestSortCompare);
    let user = JSON.parse(AuthStore.getUser());
    let name;
    name = AuthStore.getName();
    for(let guest of guests) {
      if(guest.status != 0) {
        if(guest.male) {
          male_guests.push(guest);
        } else {
          female_guests.push(guest);
        }
      } else {
        //Only view guests that we added
        if(guest.added_by == name || AuthStore.isSocial()) {
          if(guest.male) {
            un_male_guests.push(guest);
          } else {
            un_female_guests.push(guest);
          }
        }
      }
    }

    this.setState({
      male_guests: male_guests,
      female_guests: female_guests,
      unapproved_males: un_male_guests,
      unapproved_females: un_female_guests
    });
  }

  handleFilterChange(event) {
    let filter = event.target.value;
    let guests = [];
    let male_guests = [];
    let female_guests = [];
    let un_male_guests = [];
    let un_female_guests = [];
    if(filter == '') {
      guests = GuestStore.getGuests().sort(guestSortCompare);

    } else {
      guests = GuestStore.getGuests().filter((guest)=> {
        return (guest.name.toLowerCase().indexOf(filter.toLowerCase()) > -1)||(guest.added_by.toLowerCase().indexOf(filter.toLowerCase()) > -1);
      }).sort(guestSortCompare);

    }
    let user = JSON.parse(AuthStore.getUser());
    let name;
    if(user.user_metadata && user.user_metadata.name) {
      name = user.user_metadata.name;
    } else if(user.nickname) {
      name = user.nickname;
    } else {
      name = 'unknown';
    }
    for(let guest of guests) {
      if(guest.status != 0) {
        if(guest.male) {
          male_guests.push(guest);
        } else {
          female_guests.push(guest);
        }
      } else {
        //Only view guests that we added
        if(guest.added_by == name || AuthStore.isSocial()) {
          if(guest.male) {
            un_male_guests.push(guest);
          } else {
            un_female_guests.push(guest);
          }
        }
      }
    }
    this.setState({
      male_guests: male_guests,
      female_guests: female_guests,
      unapproved_males: un_male_guests,
      unapproved_females: un_female_guests,
      search_filter: filter
    });

  }

  onGuestAdd(male) {
    //We have multiple
    let guest_names = [];

    let compare_guests = GuestStore.getGuests().filter((guest) => {
      return guest.male == male;
    });

    guest_names = GuestUtils.sanitizeGuestsWithGuests(this.state.search_filter, compare_guests);

    if(guest_names.length == 0) {
      alert('No Valid Guests Found.');
    } else {
      let guests = [];

      for(let name of guest_names) {
        let new_guest = {};
        new_guest.name = name;
        new_guest.male = male;

        guests.push(new_guest);
      }

      let added_by = AuthStore.getName();
      GuestActions.addGuestsToParty({
        guests: guests,
        added_by: added_by,
        party_id: this.props.params.id
      });
    }
    this.setState({
      search_filter: ''
    });
  }

  updateParty(status) {
    if(this.state.party && this.state.party._id) {
      let shouldChange = false;

      if(new Date(this.state.party.when).getTime() > new Date().getTime()) {
        let result = confirm('Warning: The Date of the Party is later than today. This button should only be hit once guests are ready to be checked in. This button does not control whether or not guests can be added to the list.')
        shouldChange = result;
      } else {
        shouldChange = true;
      }
      if(shouldChange) {
          PartyActions.updateParty(this.state.party._id, status);
      }
    } else {
      alert('No Party to Open');
    }
  }

  render() {
    // Logic for Party
    let party_name = this.state.party.name || 'Party Not Found';

    let is_party_open = (this.state.party && this.state.party.status && (this.state.party.status == 1));

    // Create Guest List Items
    let males = [];
    if(this.state.male_guests && (this.state.male_guests.length > 0)) {
      for(let male of this.state.male_guests) {
        let result = getGuestListItem2(male, is_party_open);
        males.push(result);
      }
    } else {
      males = (
        <p>There are no males on the list.</p>
      );
    }

    let females = [];
    if(this.state.female_guests && (this.state.female_guests.length > 0)) {
      for(let female of this.state.female_guests) {
        let result = getGuestListItem2(female, is_party_open);
        females.push(result);
      }
    } else {
      females = (
        <p>There are no females on the list.</p>
      );
    }

    let un_males = [];
    if(this.state.unapproved_males && (this.state.unapproved_males.length > 0)) {
      for(let male of this.state.unapproved_males) {
        let result = getGuestListItem2(male);
        un_males.push(result);
      }
    } else {
      un_males = (
        <p>You have no male awaiting approval.</p>
      );
    }

    let un_females = [];
    if(this.state.unapproved_females && (this.state.unapproved_females.length > 0)) {
      for(let female of this.state.unapproved_females) {
        let result = getGuestListItem2(female);
        un_females.push(result);
      }
    } else {
      un_females = (
        <p>You have no female awaiting approval.</p>
      );
    }

    let male_text = (this.state.search_filter.indexOf(',') > -1) ? 'Add Males' : 'Add Male';
    let female_text = (this.state.search_filter.indexOf(',') > -1) ? 'Add Females' : 'Add Female';

    // Now Disable the Button if the Names Aren't Valid
    let add_male_enabled = (this.state.search_filter.length > 0) && (GuestUtils.sanitizeGuestsWithGuests(this.state.search_filter, this.state.male_guests).length > 0);
    let add_female_enabled = (this.state.search_filter.length > 0) && (GuestUtils.sanitizeGuestsWithGuests(this.state.search_filter, this.state.female_guests).length > 0);

    let manageText;

    if(AuthStore.isSocial()) {
      if(!is_party_open) {
        manageText = (
          <div className='row'>
            <div className='col-xs-12'>
              <h2>Party Management</h2>
              <p className='text-muted'>
                Note only one party can be open at a time. Freed only open the party when the party starts and not earlier you clown.
              </p>
              <button className='btn btn-success' onClick={this.updateParty.bind(this,1)}>Open Party</button>
            </div>
          </div>
        );
      } else {
        if(this.state.party.status == 1) {
          manageText = (
            <div className='row'>
              <div className='col-xs-12'>
                <h2>Party Management</h2>
                <button className='btn btn-danger' onClick={this.updateParty.bind(this,2)}>Close Party</button>
              </div>
            </div>
          );
        } else {
          manageText = (
            <div className='row'>
              <div className='col-xs-12'>
                <h2>Party Management</h2>
                <p className='text-muted'>
                  This party has already occurred.
                </p>
                <button className='btn btn-success' onClick={this.updateParty.bind(this,1)}>Re-open Party</button>
              </div>
            </div>
          );
        }

      }
    }

    return (
      <div>
        <h1>{ party_name }</h1>
        <input type='text' className='form-control' placeholder='Guest Name' value={this.state.search_filter} onChange={this.handleFilterChange}/>
        <button type='button' className='btn btn-male' onClick={this.onMaleAdd} disabled={!add_male_enabled}>{ male_text }</button>
        <button type='button' className='btn btn-female' onClick={this.onFemaleAdd} disabled={!add_female_enabled}>{ female_text }</button>
        <div className='row'>
          <div className='col-xs-12 col-sm-6'>
            <h3>Males</h3>
            <ul className='guest-list'>
              { males }
            </ul>
          </div>
          <div className='col-xs-12 col-sm-6'>
            <h3>Females</h3>
            <ul className='guest-list'>
              { females }
            </ul>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12 col-sm-6'>
            <h3>Males Awaiting Approval</h3>
            <ul className='guest-list'>
              { un_males }
            </ul>
          </div>
          <div className='col-xs-12 col-sm-6'>
            <h3>Females Awaiting Approval</h3>
            <ul className='guest-list'>
              { un_females }
            </ul>
          </div>
        </div>
        { manageText }
      </div>
    );
  }
}

PartyDetailComponent.defaultProps = {
};

export default PartyDetailComponent;
