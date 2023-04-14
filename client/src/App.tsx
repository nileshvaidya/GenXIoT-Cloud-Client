import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/app.module.css";
import Devices from "./components/Devices";
import MessagesComponent from "./components/Messages";
import EVENTS from "./config/events";
import { useSelector, useDispatch } from 'react-redux';
import DeviceList from "./pages/DeviceList/DeviceList";
import HomePage from "./pages/DeviceList";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DevicePage from "./pages/Devices";
import TempPage from "./pages/Temp";
import DeviceDataPage from "./pages/DeviceData";
import DeviceDataProvider, { DeviceDataContext } from "./context/DeviceData/DeviceDataContext";
import { ContextDevTool } from "react-context-devtool";

function App() {




  return (
    <DeviceDataProvider>
      <ContextDevTool context={DeviceDataContext} id="uniqContextId" displayName="Context Display Name" />
    <Router >
      <Routes>
        <Route path="/device/:deviceId" element={<DevicePage />} />
        <Route path="/device/devicedata/:deviceId/:type/:varName" element={<DeviceDataPage />}/>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/temp" element={<TempPage/>} />
         
    </Routes>
      </Router>
      </DeviceDataProvider>
  );
}

export default App;
