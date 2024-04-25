import { Schema, model } from 'mongoose';

import { UserItem } from '../types';

const UserSchema = new Schema<UserItem>({
  email: String,
  password: String,
  refresh_token: String,
  authorization_code: String,
  providerId: String,
});

export default model<UserItem>('User', UserSchema);
