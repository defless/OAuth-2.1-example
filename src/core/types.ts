import type { ObjectId } from "mongoose";


export declare interface SignupBody {
  username: string;
  password: string;
}

export declare interface AuthenticateBody {
  username?: string;
  password?: string;
  id?: ObjectId;
  refresh_token?: string;
  authorization_code?: string;
  grant_type: 'password' | 'refresh_token' | 'authorization_code';
}

export declare interface CustomError {
  code: number;
  message: string;
}