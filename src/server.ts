import express from 'express';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import authorRoutes from './routers/Author';
import bookRoutes from './routers/Books';

const router = express();

mongoose.set('strictQuery', true);
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Connected to MongoDB.');
        StartServer();
    })
    .catch((error) => {
        Logging.error(`Couldn't connect to the MongoDB`);
        Logging.error(error);
    });

const StartServer = () => {
    router.use((req, res, next) => {
        Logging.info(`Incoming -> Method : [${req.method}] - Url : [${req.url}] - IP [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            Logging.info(`Outgoing -> Method : [${req.method}] - Url : [${req.url}] - IP [${req.socket.remoteAddress}] - Status : [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    router.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
            return res.status(200).json({});
        }

        next();
    });

    /* Routes */
    router.use('/authors', authorRoutes);
    router.use('/book', bookRoutes);

    /* Health check */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /* Error handling */
    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    router.listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`);
    });
};
