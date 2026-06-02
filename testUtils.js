import mongoose from 'mongoose';

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};

export const stopDB = async () => {
  await mongoose.disconnect();
};

export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};