import mongoose from 'mongoose';

declare interface User {
  email: string;
  password: string;
  refresh_token: string;
  authorization_code: string;
}

const UserSchema = new mongoose.Schema<User>({
  email: String,
  password: String,
  refresh_token: String,
  authorization_code: String,
});

export default mongoose.model<User>('User', UserSchema);
