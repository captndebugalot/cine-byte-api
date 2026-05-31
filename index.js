import 'dotenv/config';
import mongoose from "mongoose";
import server from './server';

const { PORT = 3000, MONGO_CONNECT_URI } = process.env;

mongoose
    .connect(MONGO_CONNECT_URI)
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('MongoDB Connected');

        server.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server is listening on http://localhost:${PORT}`);
        });
    }).catch((e) => {
        // eslint-disable-next-line no-console
        console.error(`Failed to start server:`, e);
    });