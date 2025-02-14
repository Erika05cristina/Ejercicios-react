const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../main')
const Blog = require('../models/blog')

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

describe('API de Blogs', () => {
  test('Debe actualizar la cantidad de likes de un blog', async () => {
    const blogsAlInicio = await Blog.find({})
    const blogAActualizar = blogsAlInicio[0]

    const nuevoNumeroDeLikes = { likes: 20 }

    const response = await api
      .put(`/api/blogs/${blogAActualizar.id}`)
      .send(nuevoNumeroDeLikes)

    expect(response.status).toBe(200)
    expect(response.body.likes).toBe(20)
  })

})

test('Debe devolver 400 si faltan title o url', async () => {  
  const blogSinTitulo = { author: 'Anonimo', url: 'http://example.com', likes: 10 }
  const blogSinUrl = { title: 'Blog sin URL', author: 'Anonimo', likes: 5 }
  
  await api.post('/api/blogs').send(blogSinTitulo).expect(400)  
  await api.post('/api/blogs').send(blogSinUrl).expect(400)  
})

describe('Eliminar un blog', () => {
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
})


describe('API de Blogs', () => {
  test('Debe crear un nuevo blog', async () => {
    const newBlog = {
      title: 'Nuevo blog',
      author: 'Cristina',
      url: 'http://example.com/nuevo-blog',
      likes: 5
    }

    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.status).toBe(201)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd.length).toBe(1)  
    expect(blogsAtEnd.map(blog => blog.title)).toContain('Nuevo blog')
  })

})

afterAll(async () => {
  await mongoose.connection.close()
  if (server) {
    await new Promise(resolve => server.close(() => {
      console.log('Servidor detenido después de las pruebas')
      resolve()
    }))
  }
})
