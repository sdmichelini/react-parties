
import React, { Component } from 'react';

import PartyActions from '../actions/PartyActions';
import PartyStore from '../stores/PartyStore';

const COMMON_EVENTS = [
  {name:'Party', type: 0},
  {name:'Social', type: 1},
  {name:'Moderated', type:2}
];

class CreatePartyComponent extends Component {
  constructor() {
    super();
    let d = new Date();
    let month = d.getMonth() + 1;
    if(month < 10) {
      month = '0' + String(month);
    } else {
      month = String(month);
    }
    let day = d.getDate();
    if(day < 10) {
      day = '0' + String(day);
    } else {
      day = String(day);
    }
    let dateString = String(d.getFullYear()) + '-' + month +'-' + day;
    this.state = {
      currentSelect: '0',
      date: (dateString),
      name: ''
    };
    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  onChangeSelect(e) {
    let _party = COMMON_EVENTS[Number(e.target.value)];
    this.setState({
      currentSelect: e.target.value
    });
  }

  onDateChange(e) {
    this.setState({
      date: e.target.value
    });
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();
    if(!this.state.date || !this.state.name) {
      alert('Invalid Params.');
    } else {
      PartyActions.createParty({
        name: this.state.name,
        when: this.state.date,
        type: Number(this.state.currentSelect)
      });
      this.setState({
        name: ''
      });
    }
  }

  render() {
    let party_options = COMMON_EVENTS.map((party) =>
      (<option value={party.type} key={party.type}>
        {party.name}
      </option>));
    return (
      <div>
        <h2>Create Party</h2>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className='form-group'>
            <label htmlFor='name'>Party Name:</label>
            <input type='text' className='form-control' placeholder='Party Name' id='name' value={this.state.name} onChange={this.onNameChange.bind(this)}/>
          </div>
          <div className='form-group'>
            <label htmlFor='partyType'>Party Type:</label>
            <select className='form-control' id='sel1' value={this.state.currentSelect} onChange={this.onChangeSelect}>
              { party_options }
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='i'>Date:</label>
            <input type='date' value={this.state.date} onChange={this.onDateChange} className='form-control' id='i' />
          </div>
          <button className='btn btn-success' type='submit'>Create Party</button>
        </form>
      </div>
    );
  }
}

export default CreatePartyComponent;
