import mongoose from 'mongoose';
import 'dotenv/config';

import { server } from './server';

const MONGODB_URI = process.env.MONGODB_URI
  || 'mongodb://localhost:27017/oauth-sandbox';
const PORT = Number(process.env.PORT) || 3000;

try {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
} catch (error) {
  console.error('MongoDB connection error:', error);
  process.exit(1);
}

try {
  const app = server({ logger: true });
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Server listening on port ${PORT}`);
} catch (error) {
  console.error('Server start error:', error);
  process.exit(1);
}
