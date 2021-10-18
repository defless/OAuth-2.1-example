import jwt from 'jsonwebtoken';
import User from '../../core/models/user.js';
import { error, check } from '../../utils.js';

export default async (req, res, next) => {
  try {
    check(req.headers.authorization, 'authorization_header');
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findById(
      jwt.verify(token, process.env.privateKey).id
    );
    check(user, 'unauthorized', 401);
    next();
  } catch (e) {
    error(res, e);
  }
};
