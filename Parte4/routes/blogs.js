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

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { likes } = req.body

    if (likes === undefined) {
      return res.status(400).json({ error: 'El campo likes es obligatorio' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true, runValidators: true })

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog no encontrado' })
    }

    res.json(updatedBlog)
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' })
  }
})


router.delete('/:id', async (request, response) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (!deletedBlog) {
      return response.status(404).json({ error: 'Blog no encontrado' })
    }
    response.status(204).end()  // 204 No Content cuando se elimina correctamente
  } catch (error) {
    response.status(400).json({ error: 'ID inválido' })
  }
})

module.exports = router
