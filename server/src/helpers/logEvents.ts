const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
import Logger from '../utils/logging';
const logEvents = async (message:string, logName:string) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    Logger.info('LogEvents', 'Log', 'In LogEvent...');
    console.log(path.join(__dirname, 'alerts', logName));
    
    try {
        if (!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }
        if (logName === 'alarms.txt'){
            await fsPromises.appendFile(path.join(__dirname, 'alarms', logName), logItem);
        }
        if (logName === 'alerts.txt'){
            await fsPromises.appendFile(path.join(__dirname, 'alerts', logName), logItem);
        }
        if (logName === 'DI alarms.txt'){
            await fsPromises.appendFile(path.join(__dirname, 'alarms', logName), logItem);
        }
        if (logName === 'DI alerts.txt'){
            await fsPromises.appendFile(path.join(__dirname, 'alerts', logName), logItem);
        }
        // await fsPromises.appendFile(path.join(__dirname, 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

module.exports = logEvents;