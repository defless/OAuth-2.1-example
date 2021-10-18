import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import colors from 'colors';

import authRoutes from './src/services/auth/index.js';
import resourcesRoutes from './src/services/resources/index.js';

dotenv.config();

const services = [
  { name: 'auth', port: 4000, routes: authRoutes},
  { name: 'resources', port: 3000, routes: resourcesRoutes},
];

services.map( service => {
  const app = express();
  app.listen(service.port, () => {
    console.log(`[Basic-Auth-${service.name}] running on port ${service.port}`.green)
  });
  app.use(express.json());
  app.use(`/api/${service.name}`, service.routes);
})

mongoose.connect(
  'mongodb://localhost:27017/basicAuth',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('[Basic-Auth-database] Successfully connected mongo'.green))
  .catch(() => console.log('[Basic-Auth-database] Failed to connect mongo'.red));
