const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

// Modificar la conversión JSON del modelo
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()  // Convertir _id a string
    delete returnedObject._id  // Eliminar _id
    delete returnedObject.__v  // Eliminar __v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
