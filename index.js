import dotenv from 'dotenv';
import mongoose from 'mongoose';
// eslint-disable-next-line
import colors from 'colors';

import Server from './src/core/server';
import authRoutes from './src/services/auth/index';
import resourcesRoutes from './src/services/resources/index';

dotenv.config();

const services = [
  { name: 'auth', port: 4000, routes: authRoutes },
  { name: 'resources', port: 3000, routes: resourcesRoutes },
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
