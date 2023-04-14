import { useGetDeviceDatabyDeviceIdQuery } from "../../services/device/device";
import Logging from "../../util/Logging";

//import Card from '@mui/material/Card';
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
//import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Divider, Grid, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { json } from "stream/consumers";
import AnalogGuage from "./AnalogGuage";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import moment from "moment";
import heartbeatimg from "../../assets/heartbeat.gif";
import stoppedheartbeatimg from "../../assets/stoppedheartbeat.gif";
//import { CustomCard } from 'react-ui-cards';

let val;
let last;
let lastdata;
let dataFreq;
let deviceActive: boolean;
let imageUrl;
let borderStat;
let Device_Id;
const AnalogCard = ({ content }) => {
  let { an_name } = content;
  let LL = 150;
  let L = 190;
  let Set = 230;
  let H = 270;
  let HH = 300;
  let Max = 300;
  let Val = 240;
  let Label = an_name;
  let gaugeOptions = {
    LL,
    L,
    Set,
    H,
    HH,
    Max,
    Val,
    Label,
  };

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
          style={{ width: "20rem", height: "440px" }}
          className="my-3"
          id= {content.an_name}
        >
          <Card.Header as="h5" className="h5 Header" style={{ textAlign: "center" }}>
            {" "}
            {content.an_name}
          </Card.Header>
          <div style={{ height: "50px", width: "50px", textAlign: "left" }}>
            {
              <Card.Img
                src={imageUrl}
                style={{ objectFit: "contain", width: "50px", height: "50px" }}
                alt="Device Active"
              />
            }
          </div>
          <Card.ImgOverlay>
            <Card.Body as="div" className="mt-0">
              <AnalogGuage className="AnalogGuage" gaugeOptions={gaugeOptions} variableName = {content.an_name} />

              <Card.Text as="h5" style={{ textAlign: "left" }}>
                {`Last Updated : ${last} ...`}
                {/* {`Last Updated : ${moment(last).fromNow()}`} */}
              </Card.Text>
              <Card.Text>{`Data Frequency : ${dataFreq} minutes.`}</Card.Text>
              <Card.Text>{`Device Id : ${Device_Id}`}</Card.Text>
              <Link to={`/device/devicedata/${Device_Id}/analog/${content.an_name}`}>
                <div className="d-grid gap-2">
                  <Button variant="primary">View Details</Button>
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

const AnalogParam = (props: {
  device_Id: any;
  analog_Param: any;
  lastUpdated: any;
  dataFrequency: any;
}) => {
  const { device_Id, analog_Param, lastUpdated, dataFrequency } = props;
  Logging.info("Device Id in AnalogParam : " + device_Id);
  Device_Id = device_Id;
  Logging.info("analog_Param in AnalogParam : " + analog_Param);
  Logging.info("Last Updated in AnalogParam : " + lastUpdated);
  Logging.info("Data Frequency in AnalogParam : " + dataFrequency);
  const { data, isLoading, isSuccess, isError, error } =
    useGetDeviceDatabyDeviceIdQuery(device_Id);
  let analogContent;
  if (isLoading) {
    analogContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else if (isSuccess) {
    Logging.info("In Analog Param Data : " + JSON.stringify(data.deviceData));
    var analogdata = (data.deviceData);
    Logging.info("AnalogData : " + JSON.stringify(analogdata.payload));
    var jsonData = (analogdata.payload);
    Logging.info(Object.keys(jsonData));
   
    let tempLast;
    dataFreq = dataFrequency;
    for (const [key, value] of Object.entries(jsonData)) {
      if (key === analog_Param.an_name) {
        val = value;
      }
      if (key === "timestamp") {
        tempLast = value;
      }
    }
    Logging.info("Value of " + analog_Param.an_name + " : " + val);

    let a = new Date();
    let d = new Date(tempLast*1000);

    var ms = moment
      .utc(a, "DD/MM/YYYY HH:mm:ss")
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
    Logging.info("Device Status " + deviceActive);
    lastdata = last = moment(tempLast * 1000).fromNow();
    analogContent = analog_Param;
    return (
    
          <AnalogCard content={analog_Param} key={device_Id} />
       
    ) ;

  }

  return <div>{analogContent}</div>;
};
export default AnalogParam;
