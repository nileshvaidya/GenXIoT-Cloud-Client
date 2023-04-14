
import * as actionTypes from './device-actionTypes';


interface IDeviceData {
  deviceID: string;
  data: JSON;
  updated: Date;
}

export const addDevice = (device: IDeviceData) => {
  return {
    type: actionTypes.ADD_DEVICE,
    payload: {
      deviceData: device,
    },
  };

};

export const updateDeviceDate = (id: string, data: JSON, updatedTime: Date) => {
  return {
    type: actionTypes.UPDATE_DEVICE_DATA,
    payload: {
      deviceId: id,
      data,
      updatedTime,
    },
  };
};

//export const getDeviceDate = 