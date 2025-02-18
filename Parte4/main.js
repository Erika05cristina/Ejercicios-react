const express = require('express')
const cors = require('cors')
const connectDB = require('./utils/db')
const { PORT } = require('./utils/config')
const blogsRouter = require('./routes/blogs')
const usersRouter = require('./routes/users')
const { tokenExtractor } = require('./utils/middleware');
const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter) 

module.exports = app
