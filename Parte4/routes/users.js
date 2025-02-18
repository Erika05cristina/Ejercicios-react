const bcrypt = require('bcryptjs')
const express = require('express')
const User = require('../models/user')
const jwt = require('jsonwebtoken');

const usersRouter = express.Router()

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})
 

usersRouter.post('/login', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  if (!user) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

  response.status(200).send({ token, username: user.username });
});


module.exports = usersRouter
