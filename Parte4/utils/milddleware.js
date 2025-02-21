const jwt = require('jsonwebtoken');
const User = require('../models/user');
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization');
  
  console.log('Authorization header:', authorization);

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
    console.log('Extracted token:', request.token);
  } else {
    console.log('No se encontró token en la cabecera Authorization');
  }

  next();
};
const userExtractor = async (request, response, next) => {
  const { token } = request;

  console.log('Token recibido en userExtractor:', token); 

  if (!token) {
    console.log('No se recibió un token válido');
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    console.log('Token decodificado:', decodedToken);

    if (!decodedToken.id) {
      console.log('Token inválido, no tiene un ID');
      return response.status(401).json({ error: 'Token invalid' });
    }

    const user = await User.findById(decodedToken.id);

    console.log('Usuario encontrado:', user);

    if (!user) {
      console.log('No se encontró un usuario con el ID del token');
      return response.status(401).json({ error: 'User not found' });
    }

    request.user = user;
    next();
  } catch (error) {
    console.error('Error en la verificación del token:', error);
    return response.status(401).json({ error: 'Token invalid or expired' });
  }
};



module.exports = {
  tokenExtractor,
  userExtractor,
};
