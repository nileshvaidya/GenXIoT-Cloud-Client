import React, { Component } from 'react'
import Chart from 'react-google-charts'
import Logging from '../../util/Logging';


const LineChartOptions = {
  hAxis: {
    title: 'Time',
  },
  vAxis: {
    title: 'Popularity',
  },
  series: {
    1: { curveType: 'function' },
  },
 
  is3D: false,
  'chartArea': {
    'backgroundColor': {
      'fill': '#102952',
      'opacity': 10
    },
  }
}

interface iLineData {
LineData: []
}

const AnalogDataDisplay = (props: { LineData: any; }) => {

    

   const {LineData} = props;
  Logging.info("Graph Data : " + LineData)
  return (
    
    <>
    <div className="container mt-5">
      <h2>React Google Line Chart Example</h2>
      <Chart
        width={'700px'}
        height={'410px'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={LineData}
        options={LineChartOptions}
        rootProps={{ 'data-testid': '2' }}
      />
    </div>
    
      </>
  )

}
export default AnalogDataDisplay;