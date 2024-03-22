import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
  refresh_token: String,
  authorization_code: String,
});

const User = mongoose.model('User', UserSchema);

export default User;
