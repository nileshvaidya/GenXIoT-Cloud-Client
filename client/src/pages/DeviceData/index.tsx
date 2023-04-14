import { isFulfilled } from "@reduxjs/toolkit";
import moment from "moment";
import React, { useEffect, useState, useCallback, useContext, useReducer } from "react";
import { useParams } from "react-router-dom";

import AnalogParam from "../../components/Device/AnalogParamOld";
import DigitalParam from "../../components/Device/DigitalParams";
import Error from "../../components/general/Error";
import Loader from "../../components/general/Loader";
import { useGetHistoricalDeviceDatabyDeviceIdQuery, useReadDeviceByDeviceIdQuery } from "../../services/device/device";
import Logging from "../../util/Logging";
import "./index.module.scss";
import {IDeviceData} from '../../models/DeviceData';
import AnalogDataDisplay from "../../components/DeviceData/AnalogDataDisplay";
import DeviceDataContext from '../../context/DeviceData/DeviceDataContext';
import  { Component } from 'react'
import Chart from 'react-google-charts'
import { SocketContext } from "../../context/socket";
import SocketContextComponent from '../../context/Socket/Component'


let dataofdays = 7;
let myData

const LineChartOptions = {
  hAxis: {
    title: 'Time',
  },
  vAxis: {
    title: 'Parameter',
  },
  series: {
    0: { curveType: 'function' },
    
  },
  colors: ['yellow'],
  is3D: false,
  'chartArea': {
    'backgroundColor': {
      'fill': '#102952',
      'opacity': 10
    },
  }
}

var ColumnOptions = {
  title: 'Historical Digital Parameter',
  hAxis: {
    title: 'Date Time',
    format: 'DD/MM/YYYY HH:mm:ss',
    // minValue: moment().subtract(dataofdays, "days").format("DD-MM-YYYY"),
    // maxValue: moment().toNow(),
    viewWindow: {
      min: [7, 30, 0],
      max: [17, 30, 0]
    }
  },
  vAxis: {
    title: 'Status',
    minValue: 0,
    maxValue:2,
    ticks: ['OFF', 'ON']
    
  },
  is3D: false,
  'chartArea': {
    'backgroundColor': {
      'fill': '#102952',
      'opacity': 10
    },
  },
  colors: ['yellow'],
};






function DeviceDataPage() {
    let { deviceId,type,varName } = useParams();
  Logging.info("Device Id in DeviceDataPage :" + deviceId);
  Logging.info("Type in DeviceDataPage :" + type);
  Logging.info("VAriable in DeviceDataPage :" + varName);
  //let device_Id = "SBF0001";
  const [mynewData, setNewMyData] = React.useState();
  const [device_ID, setDevice_ID] = useState('')
  // const forceUpdate = React.useCallback(() => setNewMyData({}), myData);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
   function useForceUpdate(): () => void {
     return React.useState({})[1].bind(null, {}) as () => void
   }
  let dateObj = new Date();
let val = dateObj.getTime();
//86400 * 1000 * 3  Each day is 86400 seconds
let  days = 86400 * 1000 * dataofdays;

  let minutes = val - days;
  let device_Id = deviceId
  Logging.info("Set Device ID :" + device_ID);
  setDevice_ID(device_Id);
Logging.info("Set Device ID :" + device_ID);

const socket = useContext(SocketContext);

  
  
// Logging.info("Historical data since :" + moment.utc(val).format('DD-MM-YYYY HH:mm'));
  let dataContent;
  let digitalContent;
  let args = {device_Id,  minutes };
  let dXdata = []
  let dYdata = []
   let dData = [];
   let myNewData;
  function delay() {
    // `delay` returns a promise
    return new Promise(function(resolve, reject) {
      // Only `delay` is able to resolve or reject the promise
      setTimeout(function() {
        resolve(42); // After 3 seconds, resolve the promise with value 42
      }, 3000);
    });
  }

  function fetch(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(this.responseText);
      };
      xhr.onerror = reject;
      xhr.open('GET', url);
      xhr.send();
      
    });
  }

  


  
   
  
  const getDeviceData = async (device_Id:string,minutes:Number) =>{
  let url = `http://localhost:4000/devicedata/readHistoricalDeviceDataByDeviceIDVariableName/${device_Id}/${minutes}`;
    let Response = await fetch(url).then(function (response ) {
      // processData(response); 

      // Logging.info(response);
    })
      
      .catch(function () { return null });
  
  return Response;
   }

   function load (url) {
    return new Promise(async function (resolve, reject) {
      // do async thing
      const res = await fetch(url)
  
      // your custom code
      console.log('Yay! Loaded:', url)
  
      // resolve
      resolve(res) // see note below!
    })
  }
  let url = `http://localhost:4000/devicedata/readHistoricalDeviceDataByDeviceIDVariableName/${device_Id}/${minutes}`;
// run the function and receive a Promise
   const promise = load(url);
// let the Promise know what you want to do when it resolves
   promise
     .then((data) => dData);
   promise.then((data) => extractData(data));
      
  
  
   const extractData = (data: IDeviceData) => {
     Logging.info("In processData : " + (data))
     dData = (data);
     Logging.info("In processData adv : " + (dData))
     processData(dData)
     // let d = Promise.resolve(data)
     // useEffect(() => {
     //   // Logging.info("Querry Success");
     //   Logging.info("Fetching Data : " + (dData));
     
   }
   useForceUpdate();
      useEffect(() => {
       Logging.info("Really Outside : " + dData);
      }, [dData])
   
     
      useEffect(() => {
        
     } ,[myData])
      
   const processData = (data:IDeviceData) => {
     Logging.info("In processData : " + (data))
     dData = JSON.parse(data);
     Logging.info("In processData adv : " + (dData))
     dData.deviceData.map((item) => {
      dXdata.push(item.updatedAt);
       Logging.info("Device Data Y :" + item.payload[varName]);
      dYdata.push(item.payload[varName]);
      

    });
    dXdata.sort();
    // Logging.info("Device Data X :" + dXdata);
    // Logging.info("Device Data Y :" + dYdata)
    myData = [['Time', varName]];
    let i;
    for (i = 0; i < dXdata.length - 1; i++) //dXdata.length - 1
    {
      myData.push([dXdata[i], dYdata[i]]);
    }
     Logging.info(myData);
     
     if (myData !== myNewData) {
       forceUpdate();
       Logging.info ("New Data found!!!")
       
       myNewData = myData; 
     }
    //  setNewMyData(myData);

   }
   
  
  
  return (
    
    <>
      {type === 'analog' &&
        <div className="container mt-5">
          <h2>Historical Analog Data</h2>
          <Chart
            width={'1280px'}
            height={'810px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={myData}
            options={LineChartOptions}
            rootProps={{ 'data-testid': '1' }}
          />
        </div>
      }
      {
         type === 'digital' &&
        <div className="container mt-5">
        <h2>Historical Digital Data</h2>
        <Chart
          width={'1280px'}
          height={'810px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={myData}
          options={ColumnOptions}
          rootProps={{ 'data-testid': '2' }}
        />
         </div>
      }
    
      </>
  );   

  
  // useEffect(() => {
  //   Logging.info("Error : " + error);
  // }, [error]);


 
  // if (isLoading) {
  //   return <Loader size={50} />;
  // } else if (isError) {
  //   Logging.info(error);
  // } else if (isSuccess) {
  //   Logging.info("Querry Success in Success Check");
  //   Logging.info(data);

   

    // Logging.info(
    //   "Data Frequency : " + JSON.stringify(data.device.dataFrequency)
    // );
  //   let date = Date.parse(data.device.lastUpdated);
  //   Logging.info("Last Updated : " + date);
  //   analogContent = data.device.analog_params.map((item: { an_name: any }) => {
  //     Logging.info(JSON.stringify(item.an_name));

  //     return (
  //       <AnalogParam
  //         device_Id={deviceId}
  //         analog_Param={item}
  //         lastUpdated={date}
  //         dataFrequency={data.device.dataFrequency}
  //       />
  //     );
  //   });

  //   Logging.info(JSON.stringify(data.device.digital_params));
  //   digitalContent = data.device.digital_params.map(
  //     (item: { di_name: any }) => {
  //       Logging.info("Digital Params : " + JSON.stringify(item.di_name));
  //       return (
  //         <DigitalParam
  //           device_Id={deviceId}
  //           digital_Param={item}
  //           lastUpdated={date}
  //           dataFrequency={data.device.dataFrequency}
  //         />
  //       );
  //     }
  //   );
  }
 


export default DeviceDataPage;


