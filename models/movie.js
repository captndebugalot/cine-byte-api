import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number },
  director: { type: String },
  description: { type: String },
});

export default mongoose.model('movies', movieSchema);
