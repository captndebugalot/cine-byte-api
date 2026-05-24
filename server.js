
import express from 'express';
import routes from './routes';

const server = express();
server.use(express.json());

server.use(routes);

server.get('/', (req, res) => {
    res.send(`<h1>Cine-Byte Production Studio API</h1>`);
});

export default server;