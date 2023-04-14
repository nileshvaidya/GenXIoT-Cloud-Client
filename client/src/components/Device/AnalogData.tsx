import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import SocketContext from "../../context/Socket/ContextState";
import heartbeatimg from "../../assets/heartbeats.gif";
import stoppedheartbeatimg from "../../assets/stoppedheartbeats.gif";
// import { Stat } from "../../gauges/stat";
// import GuageValuesProvider, { GuageValueContext } from '../../Context/GuageValuesContext';
import { useContext, useEffect } from "react";
import Speedometer from "../guages/ReactSpeedometer";
import ReactDOM from "react-dom";
import { DeviceDataContext } from "../../context/DeviceData/DeviceDataContext";
import { useGetDeviceDatabyDeviceIdQuery } from "../../services/device/device";
import Logging from "../../util/Logging";
import moment from "moment";
import { padding } from "@mui/system";


interface AnalogCardProps {
  id: string;
  value: number;
  an_name: string;
  last: string;
  dataFrequency: string;
  device_Id: string;
}
let val;
let last;
let lastdata;
let deviceActive: boolean;
let imageUrl;
let digitalContent;
  let data1
  let isLoading1
  let isSuccess1
  let isError1
let error1
let fromSoc:boolean;
let pageLoaded = false;

let Device_Id;
const AnalogCard = (props: AnalogCardProps) => {
  let borderStat = "success";
  let imageUrl = heartbeatimg;
  let { id, value, an_name, last, dataFrequency, device_Id } = props;
  // const { values, editValue } = useContext(GuageValueContext);
  // values[parseInt(id) - 1] = value;
  // let ind = parseInt(id) - 1;
  // console.log ("In AlalogCard ind : " + ind)
  return (
    <>
      
        <div className="col-md-3" id={id}>
   
        {["Dark"].map((variant) => (
          <Card
            as="div"
            border={borderStat}
            bg={variant.toLowerCase()}
            key={variant}
            text={variant.toLowerCase() === "light" ? "dark" : "white"}
            style={{ width: "21rem", height: "420px" }}
            className="my-3"
            id={id}
          >
            <Card.Header as="h5" className="h5 Header" style={{ textAlign: "center" }} >
              {" "}
              {an_name}
            </Card.Header>
               
            <div style={{ height: "50px", width: "50px", textAlign: "right" }}>
              {
                <Card.Img
                  src={imageUrl}
                  style={{ objectFit: "contain", width: "50px", height: "50px" }}
                  alt="Device Active"
                />
              }
            </div>
            <Card.ImgOverlay >
              <Card.Body as="div" className="mt-1" id={id} style={{ height: "190px", width: "300px", alignItems: "left" }}>
                <Speedometer data={value} no={1} />

                <Card.Text as="h6" style={{ textAlign: "left" }}>
                  {`Last Updated : ${last} ...`}
                  {/* {`Last Updated : ${moment(last).fromNow()}`} */}
                </Card.Text>
                <Card.Text>{`Data Frequency : ${dataFrequency} minutes.`}</Card.Text>
                <Card.Text>{`Device Id : ${device_Id}`}</Card.Text>
                <Link to={`/device/devicedata/${device_Id}/analog/${an_name}`}>
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
  );
};

interface AnalogParamProps {
  id: string;
  analog_Param: any;
  last: any;
  dataFrequency: any;
  device_Id: string;
}
let itemNo = 0;
let tempLast;
let pLoaded = false;
let analogContent
const AnalogParam = (props: AnalogParamProps) => {
  const socket = useContext(SocketContext);
  let borderStat = "success";
  let { id, analog_Param, last, dataFrequency, device_Id } = props;
  const { actualData, updateActualData } = useContext(DeviceDataContext);

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
    let  last = moment(parseInt(tempLast,10) * 1000).fromNow();
    fromSoc = true;
    updateActualData(b);
    Logging.info("Context data : " + JSON.stringify(actualData));

    for (const [key, value] of Object.entries(actualData)) {
      if (key === analog_Param.an_name) {
        val = value;
      }
      if (key === "timestamp") {
        tempLast = value;
      }
    }
   // Logging.info("Value of " + analog_Param.an_name + " : " + val);
  
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
      imageUrl = stoppedheartbeatimg//heartbeatimg;
      borderStat = "success";
    } else {
      imageUrl = stoppedheartbeatimg;
      borderStat = "danger";
    }
   // Logging.info("Device Status " + deviceActive);
    lastdata = last = moment(tempLast * 1000).fromNow();
    analogContent = analog_Param;
    return (
      
      <AnalogCard value={val} key={device_Id} id={""} an_name={analog_Param.an_name} last={last} dataFrequency={dataFrequency} device_Id={device_Id} />
         
    );
  
   
  });

  Logging.info("Getting Data of Device ID : " + device_Id);
  //const { values, editValue } = useContext(GuageValueContext);
  const { data, isLoading, isSuccess, isError, error } =
    useGetDeviceDatabyDeviceIdQuery(device_Id);
 
  if (isLoading) {
    analogContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else if ((isSuccess)) {
    
      Logging.info("In Analog Param Data : " + JSON.stringify(data));
   
      var analogdata = (data.deviceData);
      Logging.info("AnalogData : " + JSON.stringify(analogdata.payload));
      var jsonData = (analogdata.payload);
    Logging.info("Data from API ... : " + JSON.stringify(jsonData));
    Logging.info("Fom Soc : " + fromSoc);
      // Updated now
    if (!fromSoc) {
      updateActualData(jsonData);
    }
      let dataFreq = dataFrequency;
   
      // Logging.info("Final Data to render : " + JSON.stringify(actualData));
      //for (const [key, value] of Object.entries(jsonData)) { 
      for (const [key, value] of Object.entries(actualData)) {
        if (key === analog_Param.an_name) {
          val = value;
        }
        if (key === "timestamp") {
          tempLast = value;
        }
      }
      // Logging.info("Value of " + analog_Param.an_name + " : " + val);
  
      let a = new Date();
      let d = new Date(tempLast * 1000);
  
      var ms = moment
        .utc(a, "DD/MM/YYYY HH:mm:ss")
        .diff(moment.utc(d, "DD/MM/YYYY HH:mm:ss"), "minutes");
      if (ms > dataFrequency * 3) {
        deviceActive = false; // Change to false once live data streaming is implemented
      } else {
        deviceActive = true;
      }
      if (deviceActive) {
        imageUrl = stoppedheartbeatimg; //heartbeatimg;
        borderStat = "success";
      } else {
        imageUrl = stoppedheartbeatimg;
        borderStat = "danger";
      }
      // Logging.info("Device Status " + deviceActive);
      lastdata = last = moment(tempLast * 1000).fromNow();
      analogContent = analog_Param;
      return (
      
        <AnalogCard value={val} key={device_Id} id={""} an_name={analog_Param.an_name} last={last} dataFrequency={dataFrequency} device_Id={device_Id} />
         
      );
  
    
  }
  

  return (<div  className="row my-3">{analogContent}</div>)
  
}
export default AnalogParam



