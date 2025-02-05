const mongoose = require('mongoose')

// Verifica que se haya proporcionado la contraseña
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2] // Contraseña desde el argumento

// URL de conexión a MongoDB Atlas, incluye el nombre de usuario, contraseña y la base de datos.
const url = `mongodb+srv://erika05cristin:${password}@cluster0.s3dzl.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)

// Conectar a la base de datos
mongoose.connect(url)

// Definir el esquema para las entradas de la agenda telefónica
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Crear el modelo para las entradas de la agenda
const Person = mongoose.model('Person', personSchema)

// Si hay más de 3 argumentos, es una nueva entrada
if (process.argv.length === 5) {
  const name = process.argv[3] // Nombre de la persona
  const number = process.argv[4] // Número de teléfono

  // Crear una nueva entrada y guardarla en la base de datos
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })

} else if (process.argv.length === 3) {
  // Si solo se pasa la contraseña, mostrar todas las entradas de la agenda
  console.log('phonebook:')
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
