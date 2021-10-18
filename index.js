import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import colors from 'colors';

import authRoutes from './src/routes/auth.js';
import privateServiceRoutes from './src/routes/privateService.js';

dotenv.config()
const app = express();
const port = 3000;

mongoose.connect(
  'mongodb://localhost:27017/basicAuth',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('[Basic-Auth] Successfully connected mongo'.green))
  .catch(() => console.log('[Basic-Auth] Failed to connect mongo'.red));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/private', privateServiceRoutes);

app.listen(port, () => {
  console.log(`[Basic-Auth] App is listening at http://localhost:${port}`.green)
})
