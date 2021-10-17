import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

export const login = async (req, res, next) => {
  try {
    const user = await User.where({ name: req.body.name }).findOne();
    if (!user) {
      throw 'unknown user'
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result) {
        res.status(200).json({
          accesToken: jwt.sign(
            { id: user._id, name: user.name },
            process.env.privateKey,
            { expiresIn: '900s' }
          ),
          refreshToken: user.refreshToken,
        });
      } else {
        throw 'bad password'
      }
    });
  } catch (e) {

  }
  if (req.body.password === 'password') {

  } else {
    res.status(404).json({
      error: 'incorrect password'
    });
  }
};

export const signup = async (req, res, next) => {
  try {
    const user = await User.where({ name: req.body.name }).findOne();
    if (user) {
      throw 'User already exists'
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const request = new User({
      name: req.body.name,
      password: hash,
      refreshToken: Crypto.randomBytes(64).toString('hex'),
    });
    request.save().then(() => res.status(200).json({
      message: 'user created',
    }));
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e,
    });
  }
};

export const generateKey = (req, res, next) => {
  const privateKey = Crypto.randomBytes(64).toString('hex');
  res.status(200).json({
    privateKey,
  });
};

export const generateAccessToken = async (req, res, next) => {
  const user = await User.where({ _id: req.body.id }).findOne();
  if (user.refreshToken === req.body.refreshToken) {
    res.status(200).json({
      accessToken: jwt.sign(
        { id: user._id, name: user.name },
        process.env.privateKey,
        { expiresIn: '900s' }
      ),
    });
  }
};
