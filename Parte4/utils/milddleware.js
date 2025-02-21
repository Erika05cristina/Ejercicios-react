const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Blog = require('../models/blog');

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);  
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const { token } = request;
  if (!token) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET); 
    const user = await User.findById(decodedToken.id);  

    if (!user) {
      return response.status(401).json({ error: 'User not found' });
    }

    request.user = user;  
    next();  
  } catch (error) {
    return response.status(401).json({ error: 'Token invalid or expired' });
  }
};

module.exports = {
  tokenExtractor,
  userExtractor
};
