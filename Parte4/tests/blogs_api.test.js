const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../main')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let server

beforeAll(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({}) 
  
  const newUser = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash: 'hashedpassword'
  })
  const savedUser = await newUser.save()

  const newBlog = new Blog({
    title: 'Prueba de ID',
    author: 'Cristina',
    url: 'http://example.com',
    likes: 10,
    user: savedUser._id  
  })

  await newBlog.save() 
})

describe('API de Blogs', () => {
  test('Debe actualizar la cantidad de likes de un blog', async () => {
    const blogsAlInicio = await Blog.find({})
    const blogAActualizar = blogsAlInicio[0]

    const nuevoNumeroDeLikes = { likes: 20 }

    const response = await api
      .put(`/api/blogs/${blogAActualizar.id}`)
      .send(nuevoNumeroDeLikes)
      .expect(200)

    expect(response.body.likes).toBe(20)
  })

  test('Debe devolver 400 si faltan title o url', async () => {  
    const blogSinTitulo = { author: 'Anonimo', url: 'http://example.com', likes: 10 }
    const blogSinUrl = { title: 'Blog sin URL', author: 'Anonimo', likes: 5 }
    
    await api.post('/api/blogs').send(blogSinTitulo).expect(400)  
    await api.post('/api/blogs').send(blogSinUrl).expect(400)  
  }, 10000)

  test('Debe eliminar un blog correctamente', async () => {
    const blogsAlInicio = await Blog.find({})
    
    expect(blogsAlInicio.length).toBe(1)
    const blogAEliminar = blogsAlInicio[0]
    
    await api.delete(`/api/blogs/${blogAEliminar.id}`).expect(204)
    
    const blogsAlFinal = await Blog.find({})
    expect(blogsAlFinal.length).toBe(0)
  })

  test('Debe devolver 404 si el blog no existe', async () => {
    const idInexistente = new mongoose.Types.ObjectId()
    await api.delete(`/api/blogs/${idInexistente}`).expect(404)
  })

  test('Debe devolver 400 si el ID es inválido', async () => {
    await api.delete('/api/blogs/12345').expect(400)
  })

  test('Debe crear un nuevo blog', async () => {
    const users = await User.find({})
    const user = users[0]

    const newBlog = {
      title: 'Nuevo blog',
      author: 'Cristina',
      url: 'http://example.com/nuevo-blog',
      likes: 5,
      user: user._id  
    }

    const response = await api.post('/api/blogs').send(newBlog).expect(201)

    expect(response.body.user.toString()).toBe(user._id.toString())

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd.length).toBe(2)  
    expect(blogsAtEnd.map(blog => blog.title)).toContain('Nuevo blog')
  })

  test('GET /api/blogs incluye información del usuario', async () => {
    const response = await api.get('/api/blogs').expect(200)
    expect(response.body[0].user).toHaveProperty('username')
    expect(response.body[0].user.username).toBeDefined()
  })
})

afterAll(async () => {
  await mongoose.connection.close()
  console.log('Conexión cerrada después de las pruebas')
})
