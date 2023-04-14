import deviceSlice, {
  addDevice,
  DeviceState,
  removeDevice,
} from "../services/device/deviceSlice";
import SocketProvider, { useSockets } from "../context/socket.context";
import { useDispatch, useSelector } from "react-redux";
import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  PropsWithChildren,
  useReducer,
} from "react";
import { SocketContext } from "../context/socket";
import EVENTS from "../config/events";
//import store from '../store/store';
import {
  deviceApi,
  useGetDevicesByClientIdQuery,
  useReadDeviceByDeviceIdQuery,
} from "../services/device/device";
import Logging from "../util/Logging";
import { iteratorSymbol } from "immer/dist/internal";
import _ from "underscore";
import GetDevices from "./GetDevices";
import moment from "moment";

import { useSocket } from "../hooks/useSocket";
import SocketDispatchContext, {SocketDispatchContextConsumer, SocketDispatchContextProvider,
  SocketReducer,
} from "../context/Socket/ContextDispatch";
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
//import { Link } from 'react-router-dom';

import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Divider, Stack } from "@mui/material";
import GetDevice from "./GetDevice";
import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import heartbeatimg from "../assets/heartbeats.gif";
import stoppedheartbeatimg from "../assets/stoppedheartbeats.gif";
import SocketContextComponent from "../context/Socket/Component";
import { Socket } from "socket.io-client";

let clientcode = "SBF0001";
let lastupdated;
let borderStat = "";
let deviceActive: boolean;
let imageUrl;
const DeviceCard = ({ content }) => {
  return (
    <>
      <div className="col-md-3">
        {["Dark"].map((variant) => (
          <Card
            as="div"
            border={borderStat}
            bg={variant.toLowerCase()}
            key={variant}
            text={variant.toLowerCase() === "light" ? "dark" : "white"}
            style={{ width: "20rem", height: "400px" }}
            className="my-3"
          >
            <Card.Header as="h5" style={{ textAlign: "center" }}>
              {content.name}
            </Card.Header>
            <div style={{ height: "50px", width: "50px", textAlign: "left" }}>
              {
                <Card.Img
                  src={imageUrl}
                  style={{
                    objectFit: "contain",
                    width: "50px",
                    height: "50px",
                  }}
                  alt="Device Active"
                />
              }
            </div>
            <Card.ImgOverlay>
              <Card.Body
                as="div"
                className="mt-3"
                style={{ textAlign: "center" }}
              >
                <Card.Img
                  src="./device.png"
                  style={{
                    objectFit: "contain",
                    width: "250px",
                    height: "150px",
                    marginTop: "10px",
                  }}
                  alt="Device Active"
                />
                <Card.Text
                  as="h5"
                  style={{ textAlign: "left", marginTop: "3px" }}
                >
                  {`Location : ${content.location}`}
                </Card.Text>
                <Card.Text
                  as="h6"
                  style={{ textAlign: "left", marginTop: "10px" }}
                >
                  {`Device Id : ${content.device_Id}`}
                </Card.Text>
                <Card.Text
                  as="h6"
                  style={{
                    textAlign: "left",
                    marginTop: "10px",
                    marginBottom: "20px",
                  }}
                >
                  {`Last Updated : ${moment(
                    content.lastUpdated,
                    "YYYY-MM-DDTHH:mm:ss GMT Z"
                  ).fromNow()}`}
                </Card.Text>

                <Link to={`/device/${content.device_Id}`}>
                  <div className="d-grid gap-2">
                    <Button variant="primary" style={{marginTop:"15px"}}>View Details</Button>
                  </div>
                </Link>
              </Card.Body>
            </Card.ImgOverlay>
          </Card>
        ))}
      </div>
    </>
  )
};

// export interface ISocketContextComponentProps extends PropsWithChildren {}

const Devices = () => {
  let username = "ASK01";
 
 
  

  const { data, isLoading, isSuccess, isError, error } =
    useGetDevicesByClientIdQuery(clientcode);
  let deviceContent;
  if (isLoading) {
    deviceContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else if (isSuccess) {
    Logging.info("Data : " + JSON.stringify(data.device));
    deviceContent = data.device.map((item) => {
      let a = new Date();
      //let d = new Date(tempLast*1000);

      var ms = moment
        .utc(a, "DD/MM/YYYY HH:mm:ss")
        .diff(moment.utc(item.lastUpdated), "minutes");
      Logging.info("Data Last Updated : " + ms);
      Logging.info(
        "Data Update Frequency : " + JSON.stringify(item.dataFrequency)
      );
      if (ms > item.dataFrequency * 3) {
        Logging.info("Inside");
        deviceActive = false; // Change to false once live data streaming is implemented
      } else {
        deviceActive = true;
      }
      if (deviceActive) {
        Logging.info("Active");
        imageUrl = heartbeatimg;
        borderStat = "success";
      } else {
        Logging.info("In Active");
        imageUrl = stoppedheartbeatimg;
        borderStat = "danger";
      }
      Logging.info("Elapsed : " + ms);
      Logging.info("Item : " + JSON.stringify(item));
      // setDevice_Id(item.device_Id);
      return (
      //  <div>
          <DeviceCard content={item} key={item.device_Id} />
      //  </div>
      );
    });
  } else if (isError) {
    deviceContent = (
      <div className="alert alert-danger" role="alert">
        {/* {error} */}
      </div>
    );
  }
  return (
    <>
         <div className="row my-3">
       
        {deviceContent}
      </div>
        
        
    </>
    
  );
};
export default Devices;

// const Devices = () => {
//   const clientcode = 'SBF0001';

//   const [deviceName, setDeviceName] = useState('');
//   let lastupdated = '';
//   let analogParams = [];
//   let digitalParams = [];
//   let responseInfo: any = useGetDevicesByClientIdQuery(clientcode);

//   const [skip, setSkip] = useState(false)
//   const dispatch = useDispatch();

//   if (skip) {
//     // responseInfo.data.device.map((item) => {
//     //   {
//     //    dispatch(addDevice(item.device_Id));
//     //     Logging.info("Data retrieved..." + item.device_Id);

//     //   }
//     // })

//   }

//   //console.log("Data : ", responseInfo.data)
//   // if (responseInfo.isFetching) return <div>Loading...</div>
//   // if (responseInfo.isError) return <h1>{responseInfo.error.error}</h1>

//   // { dispatch(addDevice(item.device_Id)) }

//   useEffect(() => {
//     // check whether data exists
//     if (!responseInfo.loading && !!responseInfo.data) {
//       responseInfo.data.device.map((item) => {
//         {
//           dispatch(addDevice(item.device_Id));
//           // Logging.info("Data retrieved..." + item.device_Id);
//           setDeviceName(item.name);
//           // Logging.info("Device Name..." + deviceName);
//           lastupdated = moment(item.lastUpdated, 'YYYY-MM-DDTHH:mm:ss GMT Z').fromNow();
//           Logging.info("Last Updated..." + lastupdated);
//           // analogParams = item.analog_params;
//           Logging.info("Analog Parama..." + JSON.stringify(analogParams));
//           digitalParams = item.digital_params;
//           // Logging.info("Digital Params..." + JSON.stringify(digitalParams));

//         }
//       })

//       setSkip(true)
//       // Logging.info("Skip True")
//     }
//   }, [responseInfo.data, responseInfo.loading])

//   // useEffect(() => {
//   //   //console.log("In Devices : " + message);

//   //   if (responseInfo.status === "success") {
//   //     Logging.info("Response : " + responseInfo.data);
//   //     responseInfo.data.device.map((item) => {
//   //       {
//   //         dispatch(addDevice(item.device_Id));
//   //         Logging.info(item.device_Id);
//   //         return <h1>{item.device_Id}</h1>
//   //       }
//   //     }, [responseInfo.status]);

//   //   }
//   // })
//   useEffect(() => {
//     Logging.info("Added to store");

//   }, [skip])

//   return (
//     <div className="devices">
//       <h1>Device Header</h1>
//       <p>{JSON.stringify(responseInfo.data)}</p>
//     {!responseInfo.data &&

//         responseInfo.data.device.map((item: any ) => {
//           <div>
//             <h1>Device Name : {item.name}</h1>
//             <h3>Last Updated : {moment(item.lastUpdated, 'YYYY-MM-DDTHH:mm:ss GMT Z').fromNow()}</h3>
//             <GetDevices deviceName {...item.name} />
//           </div>
//         }
//         )
//     }

//   </div>
//   )

// }

// export default Devices;
