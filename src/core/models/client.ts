import mongoose from 'mongoose';

declare interface Client {
  name: string;
  clientId: string;
  clientSecret: string;
}

const ClientSchema = new mongoose.Schema<Client>({
  name: String,
  clientId: String,
  clientSecret: String,
});

export default mongoose.model<Client>('User', ClientSchema);
