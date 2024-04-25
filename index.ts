import mongoose from 'mongoose'
import 'dotenv/config'

import { server } from './server';

try {
  await mongoose.connect('mongodb://localhost:27017/oauth-sandbox');
} catch (error) {
  console.error(error);
}

try {
  await server({ logger: true }).listen({ port: 3000 })
} catch (err) {
  console.log(err);
  process.exit(1)
}

