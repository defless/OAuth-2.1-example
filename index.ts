import mongoose from 'mongoose'
import 'dotenv/config'

import { server } from './server';

try {
  await mongoose.connect('mongodb://localhost:27017/basicAuth');
  console.log('[Basic-Auth-database] Successfully connected mongo')
} catch (error) {
  console.log('[Basic-Auth-database] Failed to connect mongo');
}

try {
  await server({ logger: true }).listen({ port: 3000 })
} catch (err) {
  console.log(err);
  process.exit(1)
}

