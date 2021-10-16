import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

export const login = (req, res, next) => {
  if (req.body.password === 'password') {
    const user = {
      _id: 'userId',
      name: 'name',
    };
    res.status(200).json({
      accesToken: jwt.sign(user, process.env.privateKey, { expiresIn: '900s' }),
      refreshToken: jwt.sign(user, process.env.privateKey, { expiresIn: '900s' }),
    });
  } else {
    res.status(404).json({
      error: 'incorrect password'
    });
  }
};

export const signup = async (req, res, next) => {
  console.log('enter');
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      password: hash,
      refreshToken: Crypto.randomBytes(64).toString('hex'),
    });
    user.save().then(() => res.status(200));
  } catch (e) {
    console.log(e);
    res.status(500);
  }

};

export const generateKey = (req, res, next) => {
  const privateKey = Crypto.randomBytes(64).toString('hex');
  res.status(200).json({
    privateKey,
  });
};
