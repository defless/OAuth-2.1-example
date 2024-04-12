import { Schema, model } from 'mongoose';

declare interface User {
  email: string;
  password: string;
  refresh_token: string;
  authorization_code: string;
  providerId: string;
}

const UserSchema = new Schema<User>({
  email: String,
  password: String,
  refresh_token: String,
  authorization_code: String,
  providerId: String,
});

export default model('User', UserSchema);
