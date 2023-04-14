import { saveDeviceData } from './db/DevicesDB';
import { nanoid } from 'nanoid';

import config from 'config';
import logger from './utils/logger';
import { processIncomingData } from './helpers/processHelpers';
// import { sendData } from './socket';
import Logging from './library/Logging';

const mqtt = require('mqtt');
const EVENTS = {
    connection: 'connection'
};

function mqttclient() {
    const port = config.get<number>('mqttport');
    const host = config.get<string>('mqtthost');
    const username = config.get<string>('mqttUsername');
    const password = config.get<string>('mqttPassword');
    const clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4);
    const clientCode = 'SBF0001';
    const connectUrl = `mqtt://${host}:${port}`;
    logger.info("URL : " + connectUrl + " Username : " + username + " Pass : " + password);
    const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        username: username,
        password: password,
        reconnectPeriod: 1000
    });
    const topicName = 'askdevicedata/#';
    let cc: string = '';

    logger.info(`MQTT enabled`);

    // connect to same client and subscribe to same topic name
    client.on('connect', () => {
        logger.info(`Inside MQTT connect`);
        // can also accept objects in the form {'topic': qos}
        client.subscribe(topicName, (err: any, granted: any) => {
            if (err) {
                logger.info(err, 'err');
            }
            logger.info(granted, 'granted')
        });
    });

    // on receive message event, log the message to the console
    client.on('message', (topic: string, message: string, packet: { payload: { toString: () => any } }) => {
        //Logging.info('Topic : ' + topic + ' , Payload : ' + message);
        let v = topic.split('/');
        if (v[0] === 'askdevicedata') {
            //logger.info(JSON.parse(message));

            saveDeviceData(v[1],clientCode, topic, message);
            processIncomingData(topic, message).then((cc) => {
                //logger.info(cc);
                //sendData(cc!, message);
                Logging.info('Device Data received!!!');
            });
        }
    });
    client.on('packetsend', (packet: any) => {
        //logger.info(packet, 'packet2');
    });
}

export default mqttclient;
