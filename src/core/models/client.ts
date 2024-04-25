import mongoose from 'mongoose';

import { ClientItem } from '../types';

const ClientSchema = new mongoose.Schema<ClientItem>({
  name: String,
  clientId: String,
  clientSecret: String,
});

export default mongoose.model<ClientItem>('Client', ClientSchema);
