import mongoose from 'mongoose';

const User = mongoose.model(
  'User',
  {
    userName: String,
    password: String,
    refresh_token: String,
  },
);

export default User;
