import { Provider } from 'react-redux';
import React, { FC, useState,createContext } from "react";
import Logging from "../../util/Logging";


import { IDeviceData } from "../../models/DeviceData";
import { DeviceDateContextType } from './types';
import ContextDevTool from 'react-context-devtool';

export  const DeviceDataContext = createContext<DeviceDateContextType |null>(null)

interface Props {
  children: React.ReactNode;
}

const DeviceDataProvider:FC<Props> = ({children}) => {
  const host = "http://localhost:8080";
  const deviceDataInitial = [];
  const actualDataInitial = {};
  const [deviceData, setDeviceData] = useState(deviceDataInitial);
  const [actualData, setActualData] = useState(actualDataInitial)

  //Get Historical Device Data
  const getHistoricalDeviceDatabyDeviceId = async(device_Id: string, minutes: number) => {
    // API Call
    const response = await fetch(`${host}/devicedata/readHistoricalDeviceDataByDeviceIDVariableName/${device_Id}/${minutes}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    });
    const json = await response.json();
    Logging.info("Contect : " + json)
    setDeviceData(json);
  }

  const updateActualData = (data: object) => {
    setActualData(data);
  }

  return (
    <DeviceDataContext.Provider value= {{ deviceData, actualData, getHistoricalDeviceDatabyDeviceId, updateActualData }}>
      {children}
     
  </DeviceDataContext.Provider>
  )
}

export default DeviceDataProvider;