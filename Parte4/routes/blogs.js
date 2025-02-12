const express = require('express')
const Blog = require('../models/blog')

const router = express.Router()

// Obtener todos los blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener blogs' })
  }
})

// Crear un nuevo blog
router.post('/', async (req, res) => {
  try {
    const { title, url, author, likes } = req.body

    if (!title || !url) {
      return res.status(400).json({ error: 'El título y la URL son obligatorios' })
    }

    const blog = new Blog({ title, author, url, likes })
    const savedBlog = await blog.save()

    res.status(201).json(savedBlog)
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el blog' })
  }
})

module.exports = router
