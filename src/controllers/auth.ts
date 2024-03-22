import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import bcrypt from 'bcrypt';

import type { signupBody } from '../core/types';

import User from '../core/models/user.js';

import { error, check } from '../utils.js';

// const grantWithPassword = async (req, res) => {
//   const user = await User.findOne({ name: req.body.name });
//   check(user, 'unknown_user', 404);
//   const result = await bcrypt.compare(req.body.password, user.password);
//   check(result, 'invalid_grant', 400);
//   const newRefreshToken = Crypto.randomBytes(64).toString('hex');
//   user.refresh_token = newRefreshToken;
//   user.save();
//   res.status(200).json({
//     access_token: jwt.sign(
//       { id: user._id, name: user.name },
//       process.env.privateKey || 'privateKey',
//       { expiresIn: '900s' },
//     ),
//     token_type: 'Bearer',
//     expires_in: 900,
//     refresh_token: user.refresh_token,
//   });
// };

// const grantWithRefresh = async (req, res) => {
//   check(req.body.id, 'invalid_request');
//   check(req.body.refresh_token, 'invalid_request');
//   const user = await User.findById(req.body.id);
//   if (user.refresh_token !== req.body.refresh_token) {
//     throw { code: 400, message: 'invalid_grant' };
//   }
//   res.status(200).json({
//     access_token: jwt.sign(
//       { id: user._id, name: user.name },
//       process.env.privateKey || 'privateKey',
//       { expiresIn: '900s' },
//     ),
//     token_type: 'Bearer',
//     expires_in: 900,
//   });
// };

// const grantWithOneTimeCode = async (req, res) => {
//   check(req.body.authorization_code, 'invalid_request');
//   const user = await User.find({ authorization_code: req.body.authorization_code });
//   check(user, 'invalid_grant', 400);
//   res.status(200).json({
//     access_token: jwt.sign(
//       { id: user._id, name: user.name },
//       process.env.privateKey || 'privateKey',
//       { expiresIn: '900s' },
//     ),
//     token_type: 'Bearer',
//     expires_in: 900,
//   });
// };

// export const authenticate = async (req, res) => {
//   try {
//     check(req.body.grant_type, 'invalid_request');
//     switch (req.body.grant_type) {
//       case 'password':
//         await grantWithPassword(req, res);
//         break;

//       case 'refresh_token':
//         await grantWithRefresh(req, res);
//         break;

//       case 'authorization_code':
//         await grantWithOneTimeCode(req, res);
//         break;

//       default:
//         throw { code: 400, message: 'invalid_grant_type' };
//     }
//   } catch (e) {
//     error(res, e);
//   }
// };

export const signup = async (req: FastifyRequest, res: FastifyReply) => {
  const { username, password } = req.body as signupBody;
  try {
    const user = await User.findOne({ name: username });
    check(!user, 'duplicated_user', 500);
    const hashedPassword = await bcrypt.hash(password, 10);
    const request = new User({
      name: username,
      password: hashedPassword,
      refresh_token: Crypto.randomBytes(64).toString('hex'),
    });
    await request.save();
    res.code(201).send({ message: 'User created' })
  } catch (e) {
    error(res, e);
  }
};
