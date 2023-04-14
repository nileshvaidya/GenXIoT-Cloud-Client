import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config, DB } from './config';
import configuration from 'config';
import { ServerSocket } from './socket';
import { Server } from 'socket.io';
import mqttclient from './mqttclient';
import Logging from './library/Logging';
import deviceRoutes from './routes/Device';
import deviceDataRoutes from './routes/DeviceData';
import bodyParser from 'body-parser';
const connectToDB = require('./db/db');
var cors = require('cors');

const port = config.server.port;
const host = config.server.host;
const mongo_url = 'mongodb://127.0.0.1:27017/genxiot'
//const mongo_url = 'mongodb://0.0.0.0:27017/genxiot';//?authSource=admin';// config.mongo.url //+ "/"+ config.mongo.db_name;
const corsOrigin = configuration.get<string>('corsOrigin');

const router = express();

router.set('view engine', 'ejs');
router.use(bodyParser.urlencoded({ extended: false }));
const options = {
    dbName: 'genxiot',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    
};
let dbConnected
// Connect to MongoDB
const  connectDB = async () => {
    console.log('connecting to mongodb...')
    try {
        await mongoose.connect('mongodb://localhost:27017/genxiot', {})

      
        dbConnected = true;
        console.log('MongoDB Connected')
        StartServer();
        
    }
    catch (err) { console.log(err) };
  }
  
//   setTimeout(() => {
//     console.log('Connect to MongoDB.');
//     connectDB();
//   }, 10000);
  
connectDB();

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        /** Log the req */
        Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the res */
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });
    // StartServer();
    // router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /** Rules of our API */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });
    /** Routes */
    router.use('/devices', cors(), deviceRoutes);
    router.use('/devicedata', cors(), deviceDataRoutes);

    /** Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /** Error handling */
    router.use((req, res, next) => {
        Logging.warning(`URL : ${req.url}`);
        const error = new Error('Route Not found');

        Logging.error(error);

        res.status(404).json({
            message: error.message
        });
    });

    const httpServer = http.createServer(router);

    /** Start Socket */
    new ServerSocket(httpServer);

    httpServer.listen(port,  () => {
        Logging.info(`Server is running ${host}:${port}`);
        Logging.info(`http://${host}:${port}`);

        mqttclient();
        
    });
};
