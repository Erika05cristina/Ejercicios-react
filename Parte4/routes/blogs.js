const express = require('express')
const User = require('../models/user')
const Blog = require('../models/blog')

const router = express.Router()

// Obtener todos los blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate('user', { username: 1, name: 1 })

    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener blogs' })
  }
})


// Crear un nuevo blog
router.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body

  const users = await User.find({})
  const randomUser = users[0]

  if (!randomUser) {
    return res.status(400).json({ error: 'No users found in the database' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: randomUser._id  
  })

  const savedBlog = await blog.save()

  randomUser.blogs = randomUser.blogs.concat(savedBlog._id)
  await randomUser.save()

  res.status(201).json(savedBlog)
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
