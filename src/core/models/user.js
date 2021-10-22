import mongoose from 'mongoose';
import Joi from 'joi';

const User = {
  model: mongoose.model(
    'User',
    { name: String, password: String, refreshToken: String }
  ),
  schema: Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export default User;
