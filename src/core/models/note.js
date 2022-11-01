import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  owner: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

export default Note;
