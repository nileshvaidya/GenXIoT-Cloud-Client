import React, { Component } from 'react'
import Chart from 'react-google-charts'
import Logging from '../../util/Logging';


const GaugeChart = (props: { options: any; gaugeData: any;variableName:any }) => {
  const { options,gaugeData,variableName } = props;
  //val.push(gaugeData, gaugeData)
  Logging.info( options)
  let cname = "GuageChart : " + variableName;
    return (
      <div className="container mt-0">
       
        <Chart
          className={cname}
                          width={250}
                height={220}
                chartType="Gauge"
                loader={<div>Loading Data</div>}
                data={gaugeData}
                options={options}
                rootProps={{ 'data-testid': JSON.stringify(gaugeData) }}
              />
      </div>
    )
  }

export default GaugeChart