import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import './DeviceCard.module.scss';
import { calculateLastUpdated } from '../../util/device';
import Logging from '../../util/Logging';


const DeviceCard = ({ className, device }) =>{
  Logging.info("In DeviceCard Device ID : " + device.device_Id)
  const { lastUpdatedBy } = calculateLastUpdated(device.lastUpdated);

  return (
    <div className="device-card-wrapper">
      <div className={className('device-card', { [className]: className })}>
        <div className="device-card__title">{device.name}</div>
        <div className="device-card__location">{device.location}</div>
        <div className="device-card__lastUpdated">{lastUpdatedBy}</div>
        <Link to={`/device/${device.device_Id}`} className="device-card__gallery">
          <img
            className="device-card__image"
            alt="View Details"
            src="../../../Public/viewdetails.png"
          />
        </Link>
      </div>
    </div>
  );
}

export default DeviceCard;