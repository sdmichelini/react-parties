/*
 Utilities for Guests. This can be sanitizing guests, etc.
*/

// Common name validator
import { nameValidator } from '../../common/validators';

// Guest store
import GuestStore from '../stores/GuestStore';

let sanitizeGuestNameWithGuests = (name, guests) => {
  // Ensure Name is Valid
  if(!nameValidator(name)) {
    return undefined;
  }
  // trim whitespace
  name = name.trim();
  // Now we compare the name to all of the current guests
  let test_name = name.toLowerCase();

  for( let guest of guests ) {
    if(guest.name.toLowerCase() === test_name) {
      return undefined;
    }
  }
  return name;
}

let sanitizeGuestNameWithGender = (name, male) => {
  let guests = GuestStore.getGuests().filter((guest) => {
    return guest.male == male;
  });
  return sanitizeGuestNameWithGuests(name, guests);
}

let sanitizeGuestsWithGuests = (names_string, guests) => {
  let final_guests = [];
  let names = names_string.split(',');
  for (let name of names) {
    let sanitized_name = sanitizeGuestNameWithGuests(name, guests);
    if(sanitized_name) {
      final_guests.push(sanitized_name);
    }
  }
  return final_guests;
}

export default {
  // Sanitize the Guest Name
  sanitizeGuestNameWithGender:sanitizeGuestNameWithGender,
  sanitizeGuestNameWithGuests:sanitizeGuestNameWithGuests,
  sanitizeGuestsWithGuests:sanitizeGuestsWithGuests
}
