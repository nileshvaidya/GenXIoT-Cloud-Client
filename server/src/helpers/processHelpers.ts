import { Moment } from 'moment';
// import { logger } from 'pino';
//import { getClientCode, updateTimeStamp } from './../db/DevicesDB';
import Logger from '../utils/logging';
//import mongoose from 'mongoose';
import { getClientCodeFromDeviceId, getDevicesById, saveDeviceData, updateTimeStamp } from '../db/DevicesDB';
import moment from 'moment';
import { ServerSocket } from '../socket';
import {IDevice} from '../models/Device';
import { IDeviceData } from '../models/DeviceData';
import { log } from 'console';
import { sendWhatsAppMsg } from '../utils/sendWhatsApp';
import { sendTelegramMsg } from '../utils/sendTelegram';
const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter { };

const myEmitter = new Emitter();
const clientMobile = '+919987585913';
myEmitter.on('alarms', (msg: string, fileName: string) => logEvents(msg, fileName));
myEmitter.on('alerts', (msg: string, fileName: string) => logEvents(msg, fileName));
const extractTimeStamp = (data: string) => {
    let json = JSON.parse(data);
    let ts = json.timestamp;
    const dateTime = moment(ts * 1000).format('YYYY-MM-DD[T]HH:mm:ss');

    // Logger.info('extractTimestamp', 'Time Stamp', dateTime);
    return dateTime;
};

const FormClientMessage = (deviceId: string, lastUpdated: string) => {
    let jsonObj = {
        deviceId: deviceId,
        lastUpdated: lastUpdated
    };

    return JSON.stringify(jsonObj);
};

export const processIncomingData = async (topic: string, message: string) => {
    const { ObjectId } = require('mongodb');
    
    let v = topic.split('/');
    if (v[0] === 'askdevicedata') {
        var device_id = v[1];
        // Logger.info('ProcessHelper', 'Device ID....................................................... : ', device_id);
        var clientCode = await getClientCodeFromDeviceId(device_id);
        /** UnComment when Data from Device needs to be saved. Commented for development */
        // Logger.info('ProcessHelper', 'Reveived Message : ', JSON.parse(message));
        // Logger.info('ProcessHelper', 'Client ID : ', clientCode);
        let tsData = extractTimeStamp(message);
        // console.log("device_id : ", device_id, "tsData :", tsData);
        
        updateTimeStamp(device_id, tsData);
        let dataTimeStamp = {};
        let str = '{"' + device_id + '":"' + tsData + '"}';
        // Logger.info('ProcessHelper', 'TimeStamp string : ', str);
        dataTimeStamp = JSON.parse(str);
        // Logger.info('ProcessHelper', 'TimeStamp object : ', dataTimeStamp);
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
        const deviceData : IDeviceData = JSON.parse(message);
        // console.log("Data Received : ", deviceData);
        CheckForAlarm(clientCode!, device_id,deviceData);
        ServerSocket.PrepareMessage(clientCode!, device_id, dataTimeStamp, JSON.parse(message));
        return clientCode;
    }
    return '';
};
const CheckForAlarm = async (clientCode:string, deviceId : string, deviceData:IDeviceData) =>
{
    const deviceTemp: IDevice |null = await getDevicesById(clientCode, deviceId);
    //console.log("deviceTemp : ", deviceTemp);
    if (deviceTemp !== null) {
        const device: IDevice = deviceTemp;
        // console.log("device in alarm : ", device);
        
        CheckAnalogParams(device,deviceData);
        CheckDigitalParams(device,deviceData);
    }
}
const CheckAnalogParams = async (device: IDevice, deviceData: IDeviceData) => {
    try {
        const analogParams = device.analog_params;
        // console.log("an_param : " , analogParams);
        const an_param_array = Object.values(analogParams);
        const dd_objects = Object.keys(deviceData)
        // console.log(dd_objects);
        // console.log("Devicedata : ", deviceData);
        // console.log(an_param_array); // Output: [{...}, {...}]
        let val;
        for (let i = 0; i < an_param_array.length; i++) {
            dd_objects.map((key) => {
                if (an_param_array[i].an_name === key) {

                    val = (deviceData as any)[key];
                    if (an_param_array[i].alert_on_high) {
                        if (parseInt(val) > an_param_array[i].high_alert_value.valueOf()) {
                            myEmitter.emit('alerts', `Param ${an_param_array[i].an_name.toString()} Value : ${val} is greater than High Alert Value which is ${an_param_array[i].high_alert_value.valueOf()} `, 'alerts.txt');
                            Logger.warn('ProcessHelper', 'Check Alarm', "Alert Received...");
                            
                            // sendWhatsAppMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alerts', val, 'high', an_param_array[i].high_alert_value.valueOf());
                            // return;
                            sendTelegramMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alerts', val, 'high', an_param_array[i].high_alert_value.valueOf());
                            return;
                        }
                    }
                    if (an_param_array[i].alarm_on_high) {
                        if (parseInt(val) > an_param_array[i].high_alarm_value.valueOf()) {
                            myEmitter.emit('alarms', `Param ${an_param_array[i].an_name.toString()} Value : ${val} is greater than High Alarm Value which is ${an_param_array[i].high_alarm_value.valueOf()} `, 'alarms.txt');
                            Logger.warn('ProcessHelper', 'Check Alarm', "Alarm Received...");
                            sendTelegramMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alarms', val, 'high', an_param_array[i].high_alarm_value.valueOf());
                            return;
                            // sendWhatsAppMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alarms', val, 'high', an_param_array[i].high_alarm_value.valueOf());
                            // return;
                        }
                    }
                    if (an_param_array[i].low_alert_value) {
                        if (parseInt(val) < an_param_array[i].low_alert_value.valueOf()) {
                            myEmitter.emit('alarms', `Param ${an_param_array[i].an_name.toString()} Value : ${val} is lower than High Alert Value which is ${an_param_array[i].low_alert_value.valueOf()} `, 'alerts.txt');
                            Logger.warn('ProcessHelper', 'Check Alarm', "Alert Received...");
                            sendTelegramMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alerts', val, 'low', an_param_array[i].low_alert_value.valueOf());
                            return;
                            // sendWhatsAppMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alerts', val, 'low', an_param_array[i].low_alert_value.valueOf());
                            // return;
                        }
                    }
                    if (an_param_array[i].low_alarm_value) {
                        if (parseInt(val) < an_param_array[i].low_alarm_value.valueOf()) {
                            myEmitter.emit('alarms', `Param ${an_param_array[i].an_name.toString()} Value : ${val} is lower than High Alert Value which is ${an_param_array[i].low_alarm_value.valueOf()} `, 'alarms.txt');
                            Logger.warn('ProcessHelper', 'Check Alarm', "Alarm Received...");
                            sendTelegramMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alarms', val, 'low', an_param_array[i].low_alarm_value.valueOf());
                            return;
                            // sendWhatsAppMsg(clientMobile, 'analog', an_param_array[i].an_name.toString(), 'alarms', val, 'low', an_param_array[i].low_alarm_value.valueOf());
                            // return;
                            
                        }
                    }
                }
                

            })
            
        }

} catch (error) {
       console.log(error);
        
}
    }
const CheckDigitalParams = async (device: IDevice, deviceData: IDeviceData) => {
    try {
        const digitalParams = device.digital_params;
        // console.log("di_param : ", digitalParams);
        const di_param_array = Object.values(digitalParams);
        const dd_objects = Object.keys(deviceData)
        // console.log(dd_objects);

        let val;
        for (let i = 0; i < di_param_array.length; i++) {
            dd_objects.map((key) => {
                if (di_param_array[i].di_name === key) {

                    val = (deviceData as any)[key];
                    if (di_param_array[i].alert_on_high) {
                        let val;
                        for (let i = 0; i < di_param_array.length; i++) {
                            dd_objects.map((key) => {
                                if (di_param_array[i].di_name === key) {

                                    val = (deviceData as any)[key];
                                    console.log("val : ", val);
                                    
                                    if (di_param_array[i].alert_on_high) {
                                        if (Boolean(val)) {
                                            myEmitter.emit('alerts', `Param ${di_param_array[i].di_name.toString()} Value : ${val} is High and this Param is set for Alert on High`, 'DI alerts.txt');
                                            Logger.warn('ProcessHelper', 'Check Digital Alarm', "Alert Received...");
                                            sendWhatsAppMsg(clientMobile, 'digital', di_param_array[i].di_name.toString(), 'alerts', 1, 'high',1);
                                            return;
                                        }
                                    }
                                    if (di_param_array[i].alarm_on_high) {
                                        if (Boolean(val)) {
                                            myEmitter.emit('alarms', `Param ${di_param_array[i].di_name.toString()} Value : ${val} is High and this Param is set for Alarm on High`, 'DI alarms.txt');
                                            Logger.warn('ProcessHelper', 'Check Digital Alarm', "Alarm Received...");
                                            sendWhatsAppMsg(clientMobile, 'digital', di_param_array[i].di_name.toString(), 'alarms', 1, 'high',1);
                                            return;
                                        }
                                    }
                                    if (di_param_array[i].alert_on_low) {
                                        if (!Boolean(val)) {
                                            myEmitter.emit('alerts', `Param ${di_param_array[i].di_name.toString()} Value : ${val} is Low and this Param is set for Alert on Low`, 'DI alerts.txt');
                                            Logger.warn('ProcessHelper', 'Check Digital Alarm', "Alerts Received...");
                                            sendWhatsAppMsg(clientMobile, 'digital', di_param_array[i].di_name.toString(), 'alerts', 0, 'low',0);
                                            return;
                                        }
                                    }
                                    if (di_param_array[i].alarm_on_low) {
                                        if (!Boolean(val)) {
                                            myEmitter.emit('alarms', `Param ${di_param_array[i].di_name.toString()} Value : ${val} is Low and this Param is set for Alarm on Low`, 'DI alarms.txt');
                                            Logger.warn('ProcessHelper', 'Check Digital Alarm', "Alarms Received...");
                                            sendWhatsAppMsg(clientMobile, 'digital', di_param_array[i].di_name.toString(), 'alarms', 0, 'low',0);
                                            return;
                                        }
                                    }
                                }

                            });
                        }
                    }
                }
            })
        }
    } catch (error) {
        console.log(error);
         
 }
    // const mappedVal = Object.keys(device.digital_params).map((key) => {
    //     const param = device.digital_params[key];
    //     const alertOnHigh = param.alert_on_high;
    //     const alarmOnHigh = param.alarm_on_high;
    //     const alertOnLow = param.alert_on_low;
    //     const alarmOnLow = param.alarm_on_low;
        
    //     console.log("Digital mapped values : ", mappedVal);
        
    //     const rData = Object.keys(deviceData.payload).map((key1) =>{
    //         if (param.toString() === deviceData.payload[key1].toString()){
    //             const valParam = deviceData.payload[key1];
    //             const val = deviceData.payload[valParam];
    //             if (alertOnHigh){
    //                 if (Boolean(val) === true){
    //                     myEmitter.emit('alerts', `Param ${param.toString()} is High`, 'alerts.txt');
    //                     return;
    //                 }
    //             }
    //             if (alarmOnHigh){
    //                 if (Boolean(val) === true){
    //                     myEmitter.emit('alarm', `Param ${param.toString()} is High`, 'alarms.txt');
    //                     return;
    //                 }
    //             }
               
    //             if (alertOnLow){
    //                 if (Boolean(val) === false){
    //                     myEmitter.emit('alerts', `Param ${param.toString()} is Low`, 'alerts.txt');
    //                     return;
    //                 }
    //             }
    //             if (alarmOnLow){
    //                 if (Boolean(val) === false){
    //                     myEmitter.emit('alarms', `Param ${param.toString()} is Low `, 'alarms.txt');
    //                     return;
    //                 }
    //             }
    //         }

    //         });
    //     })
    }
