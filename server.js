
import express from 'express';
import cors from 'cors';
import routes from './routes';

const server = express();
const allowedOrigins = [
    'http://localhost:5173',
    'https://movie-night-generator.web.app',
];

const deployedUrl = process.env.RAILWAY_PUBLIC_DOMAIN
if (deployedUrl) {
    allowedOrigins.push(deployedUrl);
}

console.log(`allowedOrigins: ${allowedOrigins}`)

server.use(cors({ origin: allowedOrigins }));
server.use(express.json());

server.use(routes);

server.get('/', (req, res) => {
    res.send(`<h1>Cine-Byte Studio API</h1>`);
});

export default server;