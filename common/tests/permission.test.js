'use strict';
const expect = require('chai').expect;

const perms = require('../permission');
describe('Permissions Test' , ()=>{
  it('should allow users w/ proper permissions', ()=>{
    expect(perms.hasPermission(perms.PERMISSIONS.editParty, ['social'])).to.be.ok;
  });

  it('should allow users w/ proper permissions for roles with multiple permissions', ()=>{
    expect(perms.hasPermission(perms.PERMISSIONS.createParty, ['president'])).to.be.ok;
  });

  it('should deny users w/ proper permissions for roles with multiple permissions', ()=>{
    expect(perms.hasPermission(perms.PERMISSIONS.createParty, ['party-user'])).to.not.be.ok;
  });

  it('should deny users w/out proper permissions', ()=>{
    expect(perms.hasPermission(perms.PERMISSIONS.editBlacklist, ['social'])).to.not.be.ok;
  });

  it('should allow admin', ()=>{
    expect(perms.hasPermission(perms.PERMISSIONS.createParty, ['admin'])).to.be.ok;
  });
});
