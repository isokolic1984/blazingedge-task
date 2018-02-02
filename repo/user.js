const assert = require('assert')
const bcrypt = require('bcrypt')
const Promise = require('bluebird')

const db = require('../db')
const {any, one, none, insert, update, updateOne, omit} = require('./base')('user')

function create (email, password, firstName, lastName, bio) {
  return Promise.resolve(bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS)))
  .catchThrow(new Error('invalid password'))
  .then(function (hash) {
    return insert({
      email: email,
      password: hash,
      first_name: firstName,
      last_name: lastName,
      bio: bio,
    })
  })
  .catchThrow(new Error('error storing user'))
}

function getByEmailPassword (email, password) {
  return one({email})
  .catchThrow(new Error('invalid username/password combination'))
  .tap(function (user) {
    return bcrypt.compare(password, user.password)
    .then(assert)
  })
  .catchThrow(new Error('invalid username/password combination'))
  .then(omit('password'))
}

function getUserById (id) {
  return one({id})
  .catchThrow(new Error('invalid user id'))
}

function updateUser (id, firstName, lastName, bio) {
  return update({id}, {first_name:firstName, last_name:lastName, bio:bio})
  //.catchThrow(new Error('unable to update user'))
}

function ensureEmailNotTaken (email) {
  return none({email})
  .catchThrow(new Error('email taken'))
}

module.exports = {
  create,
  updateUser,
  getUserById,
  getByEmailPassword,
  ensureEmailNotTaken,
}
