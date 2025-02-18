const bcrypt = require('bcryptjs')
const express = require('express')
const User = require('../models/user')

const usersRouter = express.Router()

// Obtener todos los usuarios
usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// Crear un nuevo usuario
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'Password is required' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = usersRouter
