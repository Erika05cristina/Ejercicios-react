const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: [4, 'El nombre del autor debe tener al menos 4 caracteres.'],
  },
  born: {
    type: Number,
  },
})

module.exports = mongoose.model('Author', schema)