import moment from "moment";
import { useGetDeviceDatabyDeviceIdQuery } from "../../services/device/device";
import Logging from "../../util/Logging";
import SocketContext from "../../context/Socket/ContextState";
import { DeviceDataContext } from "../../context/DeviceData/DeviceDataContext";

import heartbeatimg from "../../assets/heartbeats.gif";
import stoppedheartbeatimg from "../../assets/stoppedheartbeats.gif";

import red from '../../assets/reddot.png';
import green from '../../assets/greendot.png';
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
//import { CustomCard } from 'react-ui-cards';

let val;
let last;
let status;
let dataFreq;
let deviceActive: boolean;
let imageUrl;
let digitalImgUrl;
let borderStat;
let Device_Id;
const DigitalCard = ({ content }) => {
 
  let Label = "V2";
  

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
            style={{ width: "21rem", height: "420px" }}
            className="my-3"
          >
            <Card.Header as="h5" style={{ textAlign: "center" }}>
              {content.di_name}
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
                className="mt-5"
                style={{ textAlign: "center", marginTop: "50px" }}
              >
                {
                  <Card.Img
                    src={digitalImgUrl}
                    style={{
                      objectFit: "contain",
                      width: "100px",
                      height: "100px",
                    }}
                    alt="Device Active"
                  />
                }
                <Card.Text
                  as="h5"
                  style={{ textAlign: "center", marginTop: "20px" }}
                >
                  {`Status : ${status}`}
                  {/* {`Last Updated : ${moment(last).fromNow()}`} */}
                </Card.Text>
                <Card.Text
                  as="h6"
                  style={{ textAlign: "left", marginTop: "10px" }}
                >
                  {`Last Updated : ${last} ...`}
                  {/* {`Last Updated : ${moment(last).fromNow()}`} */}
                </Card.Text>
                <Card.Text as="h6"
                  style={{ textAlign: "left", marginTop: "10px" }}>{`Data Frequency : ${dataFreq} minutes.`}</Card.Text>
                <Card.Text as="h6"
                  style={{ textAlign: "left", marginTop: "20px" }}>{`Device Id : ${Device_Id}`}</Card.Text>
                <Link
                  to={`/device/devicedata/${Device_Id}/digital/${content.di_name}`}
                >
                  <div className="d-grid gap-8" style={{ marginTop: "30px" }}>
                    <Button variant="primary" >
                      View Details
                    </Button>
                  </div>
                </Link>
              </Card.Body>
            </Card.ImgOverlay>
          </Card>
        ))}
      </div>
    </>
  );
};
let fromSoc:boolean;
const DigitalParam = (props: {
  device_Id: any;
  digital_Param: any;
  lastUpdated: any;
  dataFrequency: any;
}) => {
  const socket = useContext(SocketContext);
  const { device_Id, digital_Param, lastUpdated, dataFrequency } = props;
  // Logging.info("Device Id in AnalogParam : " + device_Id);
  const { actualData, updateActualData } = useContext(DeviceDataContext);
  Device_Id = device_Id;
  
  const extractTimeStamp = (data: string) => {
   
    let ts = parseInt(data, 10);
    //Logging.info('ts'+ ts);
    const dateTime = moment(ts * 1000).format('YYYY-MM-DD[T]HH:mm:ss');

    //Logging.info('Time Stamp'+ dateTime);
    return dateTime;
  };
  
  socket.SocketState.socket.on('device_data', (payload: object) => {
   
    let a = JSON.stringify(payload);
    let b = eval("(" + a + ")");
    // Logging.info("data on socket : " +JSON.stringify(b));
    let lUpdated = extractTimeStamp(JSON.stringify(b.timestamp));
    let a1 = new Date();
    let tempLast;// = JSON.stringify( b.timestamp)
    let last = moment(parseInt(tempLast, 10) * 1000).fromNow();
    fromSoc = true;
    updateActualData(b);
    Logging.info("Context data : " + JSON.stringify(actualData));

    for (const [key, value] of Object.entries(actualData)) {
      if (key === digital_Param.di_name) {
        val = value;
      }
      if (key === "timestamp") {
        tempLast = value;
      }
    }
    // val = true;
    // Logging.info("Value of " + digital_Param.di_name + " : " + val);

    let at = new Date();
    let d = new Date(tempLast * 1000);

    var ms = moment
      .utc(at, "DD/MM/YYYY HH:mm:ss")
      .diff(moment.utc(d, "DD/MM/YYYY HH:mm:ss"), "minutes");
    if (ms > dataFrequency * 3) {
      deviceActive = false; // Change to false once live data streaming is implemented
    } else {
      deviceActive = true;
    }
    if (deviceActive) {
      imageUrl = heartbeatimg;
      borderStat = "success";
    } else {
      imageUrl = stoppedheartbeatimg;
      borderStat = "danger";
    }
    if (val) {
      digitalImgUrl = green;
      status = "ON"
    }
    else {
      digitalImgUrl = red;
      status = "OFF"
    }

    
   
    const lastdata = last = moment(tempLast * 1000).fromNow();
    digitalContent = digital_Param;
    return <DigitalCard content={digital_Param} key={device_Id} />;
  });

  
  const { data, isLoading, isSuccess, isError, error } =
    useGetDeviceDatabyDeviceIdQuery(device_Id);
  let digitalContent;
  if (isLoading) {
    digitalContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else if (isSuccess) {
   
    var digitaldata = (data.deviceData);
   
    var jsonData = digitaldata.payload;
    if (!fromSoc) {
      updateActualData(jsonData);
    }
   
    let tempLast;
    dataFreq = dataFrequency;
    for (const [key, value] of Object.entries(actualData)) {
      if (key === digital_Param.di_name) {
        val = value;
      }
      if (key === "timestamp") {
        tempLast = value;
      }
    }
   // val = true;
   // Logging.info("Value of " + digital_Param.di_name + " : " + val);

    let a = new Date();
    let d = new Date(tempLast*1000);

    var ms = moment
      .utc(a, "DD/MM/YYYY HH:mm:ss")
      .diff(moment.utc(d, "DD/MM/YYYY HH:mm:ss"), "minutes");
    if (ms > dataFrequency * .1) {
      deviceActive = false; // Change to false once live data streaming is implemented
    } else {
      deviceActive = true;
    }
    if (deviceActive) {
      imageUrl = heartbeatimg;
      borderStat = "success";
    } else {
      imageUrl = stoppedheartbeatimg;
      borderStat = "danger";
    }
    if (val) {
      digitalImgUrl = green;
      status = "ON"
    }
    else {
      digitalImgUrl = red;
      status = "OFF"
    }

    
   
    const lastdata = last = moment(tempLast * 1000).fromNow();
    digitalContent = digital_Param;
    return <DigitalCard content={digital_Param} key={device_Id} />;
  }
  

  return <div>{digitalContent}</div>;
};
export default DigitalParam;
