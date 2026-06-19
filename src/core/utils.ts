import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import type {
  GithubTokenItem,
  GithubUserItem,
  ThirdPartyProvider,
} from './types';
import {
  PRIVATE_KEY,
  GITHUB_PUBLIC,
  GITHUB_SECRET,
  GOOGLE_PUBLIC,
  GOOGLE_SECRET,
} from './env';

const getGithubToken = async (code: string): Promise<GithubTokenItem> => {
  const tokenRequest = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_PUBLIC,
        client_secret: GITHUB_SECRET,
        code,
      }),
    },
  );

  return await tokenRequest.json() as GithubTokenItem;
};

const getGithubUser = async (token: string): Promise<GithubUserItem> => {
  const userRequest = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  return await userRequest.json() as GithubUserItem;
};

const getGoogleToken = async (
  code: string,
  codeVerifier: string,
): Promise<any> => {
  const url = new URL('https://oauth2.googleapis.com/token');

  if (codeVerifier) {
    url.searchParams.append('code_verifier', codeVerifier);
  }

  if (!GOOGLE_PUBLIC || !GOOGLE_SECRET) {
    throw new Error('missing_google_oauth_env');
  }

  url.searchParams.append('client_id', GOOGLE_PUBLIC);
  url.searchParams.append('client_secret', GOOGLE_SECRET);
  url.searchParams.append('code', code);
  url.searchParams.append(
    'redirect_uri',
    'http://localhost:3000/auth/callback',
  );
  url.searchParams.append('grant_type', 'authorization_code');
  const tokenRequest = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return await tokenRequest.json();
};

const getGoogleUser = async (token: string): Promise<any> => {
  const userRequest = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return await userRequest.json();
};

export const getThirdPartyToken = (
  provider: ThirdPartyProvider,
  code: string,
  codeVerifier?: string,
) => {
  switch (provider) {
    case 'github':
      return getGithubToken(code);
    case 'google':
      return getGoogleToken(code, codeVerifier as string);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};

export const getThirdPartyUser = async (
  provider: ThirdPartyProvider,
  token: string,
) => {
  switch (provider) {
    case 'github':
      return await getGithubUser(token);
    case 'google':
      return await getGoogleUser(token);
    default:
      // return error
      break;
  }
};

export const generateAccessToken = (
  id: mongoose.Schema.Types.ObjectId,
  email?: string,
) => {
  const privateKey = PRIVATE_KEY || process.env.privateKey;

  if (!privateKey) {
    throw new Error('PRIVATE_KEY is not configured');
  }

  return jwt.sign(
    { id, email },
    privateKey,
    { expiresIn: '900s' },
  );
};

export const assert = () => {

};
