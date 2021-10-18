import mongoose from 'mongoose';

const User = mongoose.model('User', {
  name: String,
  password: String,
  refreshToken: String,
});

export default User;
