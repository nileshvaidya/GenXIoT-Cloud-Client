import React from 'react'
import { useSelector } from 'react-redux'
import { json } from 'stream/consumers';
import { useGetDeviceDatabyDeviceIdQuery, useReadDeviceByDeviceIdQuery } from '../services/device/device';
import Logging from '../util/Logging';

const DeviceData = (props) => {
  const { device_id } = props
  let payload = {}
  let timestamp =''
  Logging.info("Get Device Data of  : " + device_id);
  let responseInfo: any = useGetDeviceDatabyDeviceIdQuery(device_id);
  let deviceInfo: any = useReadDeviceByDeviceIdQuery(device_id);
  if (responseInfo.data) {
    
    payload = responseInfo.data.deviceData.payload;
   
      let arr = [];
      arr = Object.keys(payload).map(key =>
        <div key={payload[key]} className="row">
          <div className="col-xs-6">{key}</div>
          <div className="col-xs-6">{payload[key]}
          </div>
        </div>
      )
    
  
    Logging.info("Get Device Data :" );
    Logging.info(arr)
  }
  return (
    <div>
      {/* {responseInfo.data.map(item => <div>{item.deviceData.name}</div>)} */}
      {
        payload && <p>{JSON.stringify(payload)}</p>
        
      }
      </div>
  );
}

export default DeviceData
