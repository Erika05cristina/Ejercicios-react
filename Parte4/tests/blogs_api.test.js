const supertest = require('supertest')
const app = require('../main') 
const Blog = require('../models/blog')
const mongoose = require('mongoose')

const api = supertest(app)
let server

beforeAll(async () => {
  await Blog.deleteMany({})

  const newBlog = new Blog({
    title: 'Prueba de ID',
    author: 'Cristina',
    url: 'http://example.com',
    likes: 10
  })
  await newBlog.save() 
  server = app.listen(3003, () => {
    console.log(`🚀 Servidor corriendo en el puerto 3003`)
  })
})

describe('Verificar creación de un nuevo blog', () => {
  test('debe crear un nuevo blog y aumentar el número total de blogs en 1', async () => {
    const newBlog = {
      title: 'Nuevo blog',
      author: 'Cristina',
      url: 'http://example.com/nuevo-blog',
      likes: 5
    }

    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.status).toBe(201)
    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd.length).toBe(2)  
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Nuevo blog')
  })
})

afterAll(async () => {
  await mongoose.connection.close()

  if (server) {
    await new Promise((resolve) => {
      server.close(() => {
        console.log('Servidor detenido después de las pruebas')
        resolve() 
      })
    })
  }
})
