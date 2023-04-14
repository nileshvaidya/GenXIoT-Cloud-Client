"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processIncomingData = void 0;
// import { logger } from 'pino';
//import { getClientCode, updateTimeStamp } from './../db/DevicesDB';
var logging_1 = __importDefault(require("../utils/logging"));
//import mongoose from 'mongoose';
var DevicesDB_1 = require("../db/DevicesDB");
var moment_1 = __importDefault(require("moment"));
var socket_1 = require("../socket");
var extractTimeStamp = function (data) {
    var json = JSON.parse(data);
    var ts = json.timestamp;
    var dateTime = (0, moment_1.default)(ts * 1000).format('YYYY-MM-DD[T]HH:mm:ss');
    logging_1.default.info('extractTimestamp', 'Time Stamp', dateTime);
    return dateTime;
};
var FormClientMessage = function (deviceId, lastUpdated) {
    var jsonObj = {
        deviceId: deviceId,
        lastUpdated: lastUpdated
    };
    return JSON.stringify(jsonObj);
};
var processIncomingData = function (topic, message) { return __awaiter(void 0, void 0, void 0, function () {
    var ObjectId, v, device_id, clientCode, tsData, dataTimeStamp, str;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ObjectId = require('mongodb').ObjectId;
                v = topic.split('/');
                if (!(v[0] === 'askdevicedata')) return [3 /*break*/, 2];
                device_id = v[1];
                logging_1.default.info('ProcessHelper', 'Device ID....................................................... : ', device_id);
                return [4 /*yield*/, (0, DevicesDB_1.getClientCodeFromDeviceId)(device_id)];
            case 1:
                clientCode = _a.sent();
                /** UnComment when Data from Device needs to be saved. Commented for development */
                logging_1.default.info('ProcessHelper', 'Reveived Message : ', JSON.parse(message));
                logging_1.default.info('ProcessHelper', 'Client ID : ', clientCode);
                tsData = extractTimeStamp(message);
                (0, DevicesDB_1.updateTimeStamp)(device_id, tsData);
                dataTimeStamp = {};
                str = '{"' + device_id + '":"' + tsData + '"}';
                logging_1.default.info('ProcessHelper', 'TimeStamp string : ', str);
                dataTimeStamp = JSON.parse(str);
                logging_1.default.info('ProcessHelper', 'TimeStamp object : ', dataTimeStamp);
                // saveDeviceData(device_id, clientCode!, topic, JSON.parse(message));
                // let isClientOnline = CheckIfClientIsOnline(clientCode!);
                // if (isClientOnline) {
                //     let clientMessage = FormClientMessage(device_id, tsData);
                //     sendClientData(clientCode!, clientMessage);
                //     let isDeviceOnline = CheckIfDeviceIsOnline(device_id);
                //     if (isDeviceOnline) {
                //         sendDeviceData(device_id!, message);
                //     }
                // }
                socket_1.ServerSocket.PrepareMessage(clientCode, device_id, dataTimeStamp, JSON.parse(message));
                return [2 /*return*/, clientCode];
            case 2: return [2 /*return*/, ''];
        }
    });
}); };
exports.processIncomingData = processIncomingData;
