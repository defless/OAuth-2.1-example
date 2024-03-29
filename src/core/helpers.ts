import type { GithubTokenItem, GithubUserItem } from './types';

export const getGithubToken = async (code: string): Promise<GithubTokenItem> => {
  const tokenRequest = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GithubPublic,
      client_secret: process.env.GithubSecret,
      code,
    }),
  });

  return await tokenRequest.json();
};

export const getGithubUser = async (token: string): Promise<GithubUserItem> => {
  const userRequest = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  return await userRequest.json();
}