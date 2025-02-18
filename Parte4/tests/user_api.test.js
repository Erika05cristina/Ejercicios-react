const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../main')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

test('No se permite crear usuario sin username o password', async () => {
  const newUser = { name: 'Erika' }  

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
  
  expect(response.body.error).toBe('Username and password are required')
})

test('No se permite username o password con menos de 3 caracteres', async () => {
  const newUser = {
    username: 'er',
    name: 'Erika',
    password: '12'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  expect(response.body.error).toBe('Username and password must be at least 3 characters long')
})

test('No se permite username duplicado', async () => {
  const firstUser = {
    username: 'erikacris',
    name: 'Erika',
    password: '1234566'
  }

  await api.post('/api/users').send(firstUser).expect(201)

  const duplicateUser = {
    username: 'erikacris',
    name: 'Cris',
    password: '456874d'
  }

  const response = await api
    .post('/api/users')
    .send(duplicateUser)
    .expect(400)

  expect(response.body.error).toBe('Username must be unique')
})
test('GET /api/users muestra los blogs creados por cada usuario', async () => {
    const response = await api.get('/api/users').expect(200)
    expect(response.body[0].blogs).toBeDefined()
  })
  
afterAll(() => {
  mongoose.connection.close()
})
