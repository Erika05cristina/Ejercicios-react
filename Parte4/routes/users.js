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


usersRouter.post('/register', async (request, response) => {
  const { username, password, name } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: 'Username and password are required' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    passwordHash,
    name,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json({ username: savedUser.username, name: savedUser.name });
  } catch (error) {
    console.error('Error al guardar el usuario:', error.message);
    response.status(500).json({ error: 'Error al crear el usuario' });
  }
});

module.exports = usersRouter
