const assert = require('assert')
const bcrypt = require('bcrypt')
const Promise = require('bluebird')

const db = require('../db')
const {any, one, none, insert, update, updateOne, omit} = require('./base')('candidate')

function create (firstName, lastName, testDate) {
    return insert({
      first_name: firstName,
      last_name: lastName,
      test_date: testDate,
    })
  .catchThrow(new Error('error storing candidate'))
}

module.exports = {
  create,
}
