import type { ObjectId } from "mongoose";


export declare type ThirdPartyProvider = 'github' | 'google';

export declare type GrantType = 'password' | 'refresh_token' | 'authorization_code' | 'client_credentials';

export declare interface SignupBody {
  email?: string;
  password?: string;
  code?: string;
  code_verifier?: string;
  provider?: ThirdPartyProvider;
}

export declare interface AuthenticateBody {
  email?: string;
  password?: string;
  id?: ObjectId;
  refresh_token?: string;
  authorization_code?: string;
  grant_type: GrantType;
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