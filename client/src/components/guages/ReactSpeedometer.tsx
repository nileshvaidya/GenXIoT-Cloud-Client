import ReactSpeedometer, { Transition } from "react-d3-speedometer";
// import GuageValuesProvider, { GuageValueContext } from '../Context/GuageValuesContext';

import React, { useMemo,useContext, useEffect, useState, useReducer } from "react";
import { setValues } from "framer-motion/types/render/utils/setters";
import { render } from "react-dom";
import {DeviceDataContext} from "../../context/DeviceData/DeviceDataContext";
// import Editor from '../components/editor/editor'
// and just use it

interface SpeedometerProps {
  data: number;
  no:number
  segments?: number;
  segmentColors?: [];
  customSegmentLabels?:[]
}

export function Speedometer(props:SpeedometerProps) {
  // const { values, editValue } = useContext(GuageValueContext);
  //const [value, setValue] = useState();
  const { data, no, segments, segmentColors } = props;
  const textColor = '#ebd2d1';
  let value = data;
  const {actualData } = useContext(DeviceDataContext);
  //const [index, setIndex] = useState<number>();
  useEffect(() => {
    //setValue(data);
   
    
    // let val = values.at(no);
    //setValue(val);
    // console.log("in stat val init : " + values[no]);
    //if (no !== null)
    //forceUpdate();
    
  },[])
  useEffect(() => {
   
    // console.log("in stat val index : " + no);
    // //setValue(values[index])
    // console.log("in stat val update : " + values);
    // value = values[no];
    // console.log("in stat val update : " + value);
    //forceUpdate();
    
  }, [actualData])
  const forceUpdate: () => void = React.useState({})[1].bind(null, {})
  // function useForceUpdate(): () => void {
  //   return useReducer(() => ({}), {})[1] as () => void // <- paste here
  // }
  return (
    <ReactSpeedometer
    forceRender={true}
      value={value}
      valueFormat={'d'}
      // height={500}
      // width={500}
      minValue={0}
      maxValue={400}
      fluidWidth={true}
      needleHeightRatio={0.9}
      needleColor="steelblue"
  needleTransitionDuration={1000}
      maxSegmentLabels={6}
      currentValueText="Current Val : #{value}"
      currentValuePlaceholderStyle={'#{value}'}
      textColor={textColor}
      labelFontSize={'18px'}
    valueTextFontSize={'18px'}
    valueTextFontWeight={'100'}
    paddingHorizontal={1}
    paddingVertical={1}
      segments={6}
      ringWidth={30}
    segmentColors={[
      "#e60000",
      "#cccc00",
      "#ffff33",
      "#00ff00",
      "#ffff33",
      '#e60000'
      ]}
      customSegmentLabels={[
        {
          text: "OFF",
        
          color: "#030000",
          fontSize: "12px",
        },
        {
          text: "Very Low",
          // position: "INSIDE",
          color: "#030000",
          fontSize: "12px",
        },
        {
          text: "Low",
          // position: "INSIDE",
          color: "#030000",
          fontSize: "12px",
        },
        {
          text: "Normal",
          // position: "INSIDE",
          color: "#030000",
          fontSize: "12px",
        },
        {
          text: "High",
          // position: "INSIDE",
          color: "#030000",
          fontSize: "12px",
        },
        {
          text: "Very High",
          // position: "INSIDE",
          color: "#030000",
          fontSize: "12px",
        },
      ]}
      customSegmentStops={[0, 20, 140, 190,240,320,400]}
    />
  )
}
export default Speedometer;
