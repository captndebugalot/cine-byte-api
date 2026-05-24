import 'dotenv/config';
import mongoose from "mongoose";
import server from './server';

const port = process.env.PORT || 3000;

mongoose
    .connect('mongodb://127.0.0.1/330-cine-byte-api')
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('MongoDB Connected');

        server.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server is listening on http://localhost:${port}`);
        });
    }).catch((e) => {
        // eslint-disable-next-line no-console
        console.error(`Failed to start server:`, e);
    });