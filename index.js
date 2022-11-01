import dotenv from 'dotenv';
import mongoose from 'mongoose';
import colors from 'colors';

import Server from './src/core/server';
import authRoutes from './src/services/auth/index';
import notesRoutes from './src/services/notes/index';

dotenv.config();

const services = [
  { name: 'auth', port: 4000, routes: authRoutes },
  { name: 'notes', port: 3000, routes: notesRoutes },
];

services.map(async (service) => {
  const app = await Server(service, '/api');
  app.start();
});

mongoose.connect(
  'mongodb://localhost:27017/basicAuth',
  { useNewUrlParser: true, useUnifiedTopology: true },
)
  .then(() => console.log('[Basic-Auth-database] Successfully connected mongo'.green))
  .catch(() => console.log('[Basic-Auth-database] Failed to connect mongo'.red));
