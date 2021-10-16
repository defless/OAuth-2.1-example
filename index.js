import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
const app = express();
const port = 3000;
import authRoutes from './src/routes/auth.js';
import privateServiceRoutes from './src/routes/privateService.js';

mongoose.connect('mongodb://localhost:27017/oAuth',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Successfully connected mongo'))
  .catch(() => console.log('Failed to connect mongo'));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/private', privateServiceRoutes);

app.get('/', (req, res) => {
  res.send('API is working')
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)
})
