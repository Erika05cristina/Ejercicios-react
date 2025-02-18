const express = require('express')
const User = require('../models/user')
const Blog = require('../models/blog')
const { tokenExtractor } = require('../utils/milddleware');
const jwt = require('jsonwebtoken');

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


router.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;
  const user = request.user;  

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id  
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

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


router.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const user = request.user; 

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }
 
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'Unauthorized to delete this blog' });
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();  
});


module.exports = router
