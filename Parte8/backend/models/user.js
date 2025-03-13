const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});
 
userSchema.methods.isCorrectPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};
 
userSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
