import React from 'react';

import './index.module.scss';

import DeviceList from './DeviceList';
import Devices from '../../components/Devices';

function HomePage() {
  return (
    <>
     <div className="col my-3"> 
        Welcome to ASK Info-Solution's IoT Portal
        </div>
      <Devices />
  {/* //  </div> */}
       </>
  )
}

export default HomePage;