import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import AnalogParam from "../../components/Device/AnalogData";
import DigitalParam from "../../components/Device/DigitalParams";
import Error from "../../components/general/Error";
import Loader from "../../components/general/Loader";
import { useReadDeviceByDeviceIdQuery } from "../../services/device/device";
import Logging from "../../util/Logging";
import "./index.module.scss";
import SocketContext from "../../context/Socket/ContextState";
import { useSocket } from '../../hooks/useSocket';
// import { defaultSocketContextState, SocketContextProvider, SocketReducer } from "../../context/Socket/ContextDispatch";
import moment from "moment";
import { Chart } from "react-google-charts";
import {DeviceDataContext} from "../../context/DeviceData/DeviceDataContext";
import SocketDispatchContext from "../../context/Socket/ContextDispatch";

let param1 = '';
let gaugeData =[[],[]];
let header = []
let val = [];
let pageLoaded = false;
const DevicePage = React.memo(() => {
  let { deviceId } = useParams();
  //Logging.info("Device Id in DevicePage :" + deviceId);
  //let device_Id = "SBF0001";
  const { actualData, updateActualData } = useContext(DeviceDataContext);
  const [device, setDevice] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  let dt = { "a": "b" };
  let v = JSON.stringify(dt);
  let analogContent;
  let digitalContent;
  //   let data
  // let isLoading
  //   let isSuccess
  //   let isError
  //   let error
  const [initLoad, setInitLoad] = useState(false);
  
  //const socket = useContext(SocketContext);
  const socket = useContext(SocketDispatchContext);
  const AddDeviceToSocket = (device_Id: string) => {
    
    console.log('Request to add Device to Device List...');
    socket.AddDeviceToSocket(device_Id);
    
  }

  const RemoveDeviceFromSocket = () => {
    console.log('Request to add Device to Device List...');
    socket.RemoveDeviceFromSocket();
    
  }

  useEffect(() => {
    
    AddDeviceToSocket(deviceId);
    
    return () => {
      RemoveDeviceFromSocket();
    }
  }, []);

 
 

  

  const { data, isLoading, isSuccess, isError, error } =
   
    useReadDeviceByDeviceIdQuery(deviceId);
   
 

  if (isLoading) {
    return <Loader size={50} />;
  } else if (isError) {
    Logging.info(error);
  } else if (isSuccess) {
    // Logging.info("Data from API " + JSON.stringify(data));
    // Logging.info(
    //   "Data Frequency : " + JSON.stringify(data.device.dataFrequency)
    // );
    Logging.info("Before InitLoad....");
     
    let date = Date.parse(data.device.lastUpdated);
    let analogItem = 0;
    let digitalItem = 0;
    Logging.info("Last Updated fro index : " + date);
    analogContent = data.device.analog_params.map((item: { an_name: any }) => {
      Logging.info("Calling Alalog Data....");
     
      return (
        <AnalogParam
          id={deviceId}
          analog_Param={item}
          last={date}
          dataFrequency={data.device.dataFrequency}
          device_Id={deviceId}
        />
      );
    });

    // Logging.info(JSON.stringify(data.device.digital_params));
    digitalContent = data.device.digital_params.map(
      (item: { di_name: any }) => {
        // Logging.info("Digital Params : " + JSON.stringify(item.di_name));
        return (
          <DigitalParam
            device_Id={deviceId}
            digital_Param={item}
            lastUpdated={date}
            dataFrequency={data.device.dataFrequency}
          />
        );
      }
    );
  }
  
  return (
    <>
      <div className="row my-3">
      
        {analogContent}
        {digitalContent}
      </div>
        
        
    </>
    // Logging.info(JSON.stringify(digital));
  );
});

export default DevicePage;
