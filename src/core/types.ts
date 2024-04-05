import type { ObjectId } from "mongoose";


export declare type ThirdPartyProvider = 'github' | 'google';

export declare interface SignupBody {
  email?: string;
  password?: string;
  code?: string;
  provider?: ThirdPartyProvider;
}

export declare interface AuthenticateBody {
  email?: string;
  password?: string;
  id?: ObjectId;
  refresh_token?: string;
  authorization_code?: string;
  grant_type: 'password' | 'refresh_token' | 'authorization_code';
}

export declare interface GithubTokenItem {
  access_token: string;
  token_type: string;
  scope: string;
}

export declare interface GithubUserItem {
  id: number;
  email: string;
}