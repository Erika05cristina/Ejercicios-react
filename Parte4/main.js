require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.error('Error al conectar a MongoDB:', error))

app.use(cors())
app.use(express.json())

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

app.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

app.post('/api/blogs', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
