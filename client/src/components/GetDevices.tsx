import { useSelector } from "react-redux"
import Logging from "../util/Logging"
import _ from 'underscore'
import { DeviceState } from "../services/device/deviceSlice"
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, useEffect } from "react"
import { useGetDeviceDatabyDeviceIdQuery, useReadDeviceByDeviceIdQuery } from "../services/device/device"
import DeviceData from "./DeviceData"
import GetDevice from "./GetDevice"

const GetDevices = (props) =>{

  const deviceData = [{}]
  
  const { deviceName } = props
  Logging.info("Device Name received : " + deviceName)
  const device_Ids = useSelector((state: DeviceState) => state.deviceSlice.device_Ids, _.isEqual)
  // const deviceName =useSelector((state: DeviceState) => state.deviceApi.queries.getDevicesByClientID.data.device.name)
  
  Logging.info("Get Device : " + device_Ids)
  device_Ids.map((item: string) => {
    Logging.info("item : " + item)
    // Logging.info("name : " + deviceName)
    
  })
  
  // function getDeviceData(device_Id: string){
  //   let responseInfo: any = useGetDeviceDatabyDeviceIdQuery(device_Id);
  //   Logging.info("devices : " + responseInfo)
  //   deviceData.push(responseInfo)
  // }

  

  return (
    
    <div className="devices">
      <h1>Device List</h1>
      {
        device_Ids.map((item: string ) => {
          
          return (
            <div>
              <h2>{deviceName}</h2>
              <li key="{item}">{item}</li>
              <GetDevice device_Id ={item} />
              <DeviceData device_id = {item} />
            </div>
          )
          
        })
        
      }
    </div>
  )
}


export default GetDevices;