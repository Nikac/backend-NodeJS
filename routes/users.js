const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require('jsonwebtoken');
const config = require('../config.js');
const auth = require('../middleware/auth');

const { User, validateUser, validateLogin } = require("../models/user");

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists.");

  user = new User(
    _.pick(req.body, ["firstName", "lastName", "email", "gender", "password"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.send(_.pick(req.body, ["firstName", "lastName", "email"]));
});

router.post('/login', async (req, res) => {
  const {error} = validateLogin(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send('Invalid email or password.');

  const token = jwt.sign({id: user._id, firstName: user.firstName, lastName: user.lastName}, config.mySecureKey);
  res.header('x-auth-token', token).send(token);
});

router.get('/me', auth, async (req, res) => {
   const user = await User.findById(req.user.id).select('-password -__v');
   res.send(user);
});

module.exports = router;
