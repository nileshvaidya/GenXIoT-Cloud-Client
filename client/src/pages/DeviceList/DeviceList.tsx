import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from "react-router-dom";
import Error from '../../components/general/Error';
import Loader from '../../components/general/Loader';
import { useGetDevicesByClientIdQuery } from "../../services/device/device";
import Logging from "../../util/Logging";
import DeviceCard from './DeviceCard';
import './index.module.scss';

function DeviceList() {
  //let { cliencode } = useParams();
  let clientcode = "SBF0001";

  // const [devices, setDevices] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [errors, setErrors] = useState(null);

  

  let deviceContent
  const {
    data: devices,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetDevicesByClientIdQuery(clientcode);
  // setDevices(devices)
  

  if (isLoading) {
    return <Loader size={50} />;
  } else if (isError) {
    Logging.info("Error : " + error)
  } else if (isSuccess) {
    Logging.info(JSON.stringify(devices));
    
      devices.device.map((device: { device_Id: string; }) => {
        Logging.info("Device ID : " + device.device_Id)
      });
    
      return (
        <div className="devices">
          { deviceContent = devices.device.map((item) => {
            <DeviceCard key={item.id} device={item} className={'device-card'} />
          })}
        </div>
      );
    }

  }

export default DeviceList;