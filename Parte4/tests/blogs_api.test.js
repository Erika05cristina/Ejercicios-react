const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // Importa la app de Express
const Blog = require('../models/blog') // Modelo de blogs
const api = supertest(app) // SuperTest para hacer peticiones HTTP

const initialBlogs = [
  {
    title: 'Primer Blog',
    author: 'Autor 1',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Segundo Blog',
    author: 'Autor 2',
    url: 'http://example.com/2',
    likes: 10
  }
]

// Antes de cada prueba, limpia la BD y agrega datos iniciales
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('GET /api/blogs', () => {
  test('devuelve todos los blogs en formato JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
