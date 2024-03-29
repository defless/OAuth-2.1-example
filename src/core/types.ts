import type { ObjectId } from "mongoose";


export declare interface SignupBody {
  email?: string;
  password?: string;
  code?: string;
}

export declare interface AuthenticateBody {
  email?: string;
  password?: string;
  id?: ObjectId;
  refresh_token?: string;
  authorization_code?: string;
  grant_type: 'password' | 'refresh_token' | 'authorization_code';
}