const joi = require('joi')
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const helper = require('../middleware/helper')
const authenticate = require('../middleware/authenticate')
const userRepo = require('../repo/user')
const candidateRepo = require('../repo/candidate')
const validate = require('../middleware/validate')

router.use(helper.api)
router.use(authenticate.checkToken)

router.post('/auth', validate('body', joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().required(),
})), function (req, res) {
  const {email, password} = req.vbody

  userRepo.getByEmailPassword(email, password)
  .then(function (user) {
    return jwt.sign({id: user.id}, process.env.JWT_SECRET)
  })
  .then(res.apiSuccess)
  .catch(res.apiFail)
})

router.post('/register', validate('body', joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  firstName: joi.string().trim().optional(),
  lastName: joi.string().trim().optional(),
  bio: joi.string().trim().optional(),
})), function (req, res) {
  const {email, password, firstName, lastName, bio} = req.vbody

  userRepo.create(email, password, firstName, lastName, bio)
  .then(res.apiSuccess)
  .catch(res.apiFail)
})

router.put('/user/:id', validate('body', joi.object().keys({
  firstName: joi.string().trim().optional(),
  lastName: joi.string().trim().optional(),
  bio: joi.string().trim().optional(),
})), function (req, res) {
  const {firstName, lastName, bio} = req.vbody
  var id = req.params.id;

  // UPDATE zadatak.user SET first_name=firstName, last_name=lastName, bio=bio WHERE id=id;
  userRepo.updateUser(id, firstName, lastName, bio)
  .then(function (user) {
    return userRepo.getUserById(id)
    .then(function (user) {
      return {user}
    })
  })
  .then(res.apiSuccess)
  .catch(res.apiFail)
})

router.get('/user/:id', function (req, res) {
  var id = req.params.id;
  var valid = validate('body', joi.object().keys({
   id: joi.string().trim().optional()
 }))

  if(valid){
    // SELECT email, password, first_name, last_name, bio FROM zadatak.user WHERE id=id;
    var user = userRepo.getUserById(id)
    .then(function (user) {
      return {user}
    })
    .then(res.apiSuccess)
    .catch(res.apiFail)
  }
})

router.post('/candidate', validate('body', joi.object().keys({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  testDate: joi.string().required(),
})), function (req, res) {
  const {firstName, lastName, testDate} = req.vbody

  var candidate = candidateRepo.create(firstName, lastName, testDate)
  .then(res.apiSuccess)
  .catch(res.apiFail)
})

router.put('/user', validate('body', joi.object().keys({
  firstName: joi.string().trim().optional(),
  lastName: joi.string().trim().optional(),
  bio: joi.string().trim().optional(),
})), function (req, res) {
  const {firstName, lastName, bio} = req.vbody
  var id = req.decoded.id;

  // UPDATE zadatak.user SET first_name=firstName, last_name=lastName, bio=bio WHERE id=id;
  userRepo.updateUser(id, firstName, lastName, bio)
  .then(function (user) {
    return userRepo.getUserById(id)
    .then(function (user) {
      return {user}
    })
  })
  .then(res.apiSuccess)
  .catch(res.apiFail)
})

router.get('/user', function (req, res) {
  var id = req.decoded.id;
  var valid = validate('body', joi.object().keys({
   id: joi.string().trim().optional()
 }))

  if(valid){
    // SELECT email, password, first_name, last_name, bio FROM zadatak.user WHERE id=id;
    var user = userRepo.getUserById(id)
    .then(function (user) {
      return {user}
    })
    .then(res.apiSuccess)
    .catch(res.apiFail)
  }
})


module.exports = router
