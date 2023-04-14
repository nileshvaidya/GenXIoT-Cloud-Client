import { red } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import { createRef, useEffect, useRef, useState } from 'react';


import Logging from '../../util/Logging';
import GaugeChart from './GuageChart';




let gaugeData =[[],[]];
let header = []
let val = []




const AnalogGuage = (props) => {
  const { gaugeOptions, variableName } = props
  Logging.info(gaugeOptions);
  let setVals = [gaugeOptions.LL, gaugeOptions.L, gaugeOptions.Set, gaugeOptions.H,gaugeOptions.HH, gaugeOptions.Max]
  let arcVals = calculatArcLength();
  Logging.info(setVals);
  let max = 300;
  header = ['Label', 'Value']
  val = [gaugeOptions.Label, gaugeOptions.Val];
  //gaugeData =(header)
  //gaugeData = header.concat(val);
  for (var i = 0; i < 2; i++) {
    if (i === 0) {
      gaugeData[i] =header;
    }
    else if (i === 1) {
      gaugeData[i] = val
    }

  }
  let options = {
    yellowFrom: 0,
    yellowTo: setVals[1],
    greenFrom: setVals[1],
    greenTo: setVals[3],
    redFrom: setVals[3],
    redTo: setVals[4],
    max: setVals[5],
    min: 0,
    majorTicks: [0,50,100,150,200,250,300],
    minorTicks: 5
  }

  Logging.info("GaugeData" +  gaugeData)
  function  calculatArcLength()
  {
    const max = setVals[4] + 0;
    const arc1 = setVals[0] / max;
    const arc2 = (setVals[1]-setVals[0]) / max;
    const arc3 = (setVals[2]-setVals[1]) / max;
    const arc4 = (setVals[3]-setVals[2])/ max;
    const arc5 = (setVals[4]-setVals[3]) / max;

    let arcs = [];
    arcs.push(arc1, arc2, arc3, arc4, arc5, 1)
    return arcs;
  }


  return (
    
 
   
      
      <GaugeChart options={options}  gaugeData= {gaugeData} variableName = {variableName} />
  
)
}

export default AnalogGuage;



