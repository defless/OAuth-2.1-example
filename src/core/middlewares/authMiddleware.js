import jwt from 'jsonwebtoken';
import User from '../models/user';
import { error, check } from '../../utils';

export default async (req, res, next) => {
  try {
    check(req.headers.authorization, 'authorization_header');
    const token = req.headers.authorization.split(' ')[1];
    const userId = jwt.verify(token, process.env.privateKey).id;
    const user = await User.model.findById(userId);
    check(user, 'unauthorized_client', 401);
    next();
  } catch (e) {
    error(res, e);
  }
};
