"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DevicesDB_1 = require("./db/DevicesDB");
var config_1 = __importDefault(require("config"));
var logger_1 = __importDefault(require("./utils/logger"));
var processHelpers_1 = require("./helpers/processHelpers");
// import { sendData } from './socket';
var Logging_1 = __importDefault(require("./library/Logging"));
var mqtt = require('mqtt');
var EVENTS = {
    connection: 'connection'
};
function mqttclient() {
    var port = config_1.default.get('mqttport');
    var host = config_1.default.get('mqtthost');
    var username = config_1.default.get('mqttUsername');
    var password = config_1.default.get('mqttPassword');
    var clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4);
    var clientCode = 'SBF0001';
    var connectUrl = "mqtt://".concat(host, ":").concat(port);
    logger_1.default.info("URL : " + connectUrl + " Username : " + username + " Pass : " + password);
    var client = mqtt.connect(connectUrl, {
        clientId: clientId,
        clean: true,
        connectTimeout: 4000,
        username: username,
        password: password,
        reconnectPeriod: 1000
    });
    var topicName = 'askdevicedata/#';
    var cc = '';
    logger_1.default.info("MQTT enabled");
    // connect to same client and subscribe to same topic name
    client.on('connect', function () {
        logger_1.default.info("Inside MQTT connect");
        // can also accept objects in the form {'topic': qos}
        client.subscribe(topicName, function (err, granted) {
            if (err) {
                logger_1.default.info(err, 'err');
            }
            logger_1.default.info(granted, 'granted');
        });
    });
    // on receive message event, log the message to the console
    client.on('message', function (topic, message, packet) {
        //Logging.info('Topic : ' + topic + ' , Payload : ' + message);
        var v = topic.split('/');
        if (v[0] === 'askdevicedata') {
            //logger.info(JSON.parse(message));
            (0, DevicesDB_1.saveDeviceData)(v[1], clientCode, topic, message);
            (0, processHelpers_1.processIncomingData)(topic, message).then(function (cc) {
                //logger.info(cc);
                //sendData(cc!, message);
                Logging_1.default.info('Device Data received!!!');
            });
        }
    });
    client.on('packetsend', function (packet) {
        //logger.info(packet, 'packet2');
    });
}
exports.default = mqttclient;
