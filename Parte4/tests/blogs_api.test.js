const supertest = require('supertest')
const app = require('../main') // Importamos la aplicación desde main.js
const Blog = require('../models/blog')
const mongoose = require('mongoose')

const api = supertest(app)
let server

beforeAll(async () => {
  // Iniciar el servidor en el bloque beforeAll
  await Blog.deleteMany({})  // Limpiar la base de datos

  const newBlog = new Blog({
    title: 'Prueba de ID',
    author: 'Cristina',
    url: 'http://example.com',
    likes: 10
  })
  await newBlog.save()  // Guardar el blog en la base de datos para la prueba

  // Iniciar el servidor y guardarlo en la variable 'server'
  server = app.listen(3003, () => {
    console.log(`🚀 Servidor corriendo en el puerto 3003`)
  })
})

describe('Verificar ID de los blogs', () => {
  test('la propiedad de identificador único se llama id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    // Verificamos que haya al menos un blog
    expect(blogs.length).toBeGreaterThan(0)

    // Verificamos que el primer blog tenga la propiedad 'id'
    expect(blogs[0].id).toBeDefined()
    expect(typeof blogs[0].id).toBe('string')

    // Aseguramos que no exista la propiedad '_id'
    expect(blogs[0]._id).toBeUndefined()
  })
})

afterAll(async () => {
    // Cerrar la conexión a la base de datos
    await mongoose.connection.close()
  
    // Asegurarnos de que el servidor se cierre de manera correcta y esperar su cierre
    if (server) {
      await new Promise((resolve) => {
        server.close(() => {
          console.log('Servidor detenido después de las pruebas')
          resolve()  // Resolver la promesa cuando el servidor haya cerrado
        })
      })
    }
  })
  