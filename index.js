import 'dotenv/config';
import mongoose from 'mongoose';
import server from './server';

const { PORT = 3000, MONGO_CONNECT_URI } = process.env;

mongoose
  .connect(MONGO_CONNECT_URI)
  .then(() => {
    console.log('MongoDB Connected');

    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error(`Failed to start server:`, e);
  });
