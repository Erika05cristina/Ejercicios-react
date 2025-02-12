const express = require('express')
const cors = require('cors')
const connectDB = require('./utils/db')
const { PORT } = require('./utils/config')
const blogsRouter = require('./routes/blogs')

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
})
