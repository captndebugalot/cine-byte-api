import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  roles: { type: [String], required: true, enum: ['user', 'admin'] },
});

export default mongoose.model('User', userSchema);
