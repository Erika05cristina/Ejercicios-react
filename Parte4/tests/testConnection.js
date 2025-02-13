const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.TEST_MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error de conexión:', err));
