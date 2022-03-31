import mongoose from 'mongoose';

const User = mongoose.model(
  'User',
  {
    userName: String,
    password: String,
    refresh_token: String,
    authorization_code: String,
  },
);

export default User;
