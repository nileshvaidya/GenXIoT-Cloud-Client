import { IDeviceData } from './../../models/DeviceData';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Logging from '../../util/Logging';

interface historicalDeviceDataVariables{
  device_Id: string;
  minutes: Number;
}

export const deviceApi = createApi({
  reducerPath: 'deviceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/',
  }),
  endpoints: (builder) => ({
    getDevicesByClientId: builder.query({
      query: (clientcode) => ({
        url: `devices/getDevicesByClientId/${clientcode}`,
        method: 'GET'
      })
      
      
    }),
    readDeviceByDeviceId: builder.query({
      query: (device_ID) => ({
        url: `devices/readDeviceBYDeviceId/${device_ID}`,
        method: 'GET'
      })
      
      
    }),
    
    getDeviceDatabyDeviceId: builder.query({
      query: (device_ID) => ({
        url: `devicedata/readDeviceDataByDeviceID/${device_ID}`,
        method: 'GET'
        
      })
    }),
    getHistoricalDeviceDatabyDeviceId: builder.query<IDeviceData[],historicalDeviceDataVariables>({ 
      query: ({device_Id,  minutes }) => ({
        //  const { device_Id, minutes } = args;
        
        
        // url: `devicedata/readHistoricalDeviceDataByDeviceIDVariableName/8876859487/1660710410890`,
        
          url: `devicedata/readHistoricalDeviceDataByDeviceIDVariableName/${device_Id}/${minutes}`,
        method: 'GET',
        transformResponse: (response: { data: IDeviceData[] }, meta, arg) => response.data,
        // providesTags: (result, error, id) => [{ type: 'GET' }],
        
         
        })
        
      
     
    }),
    
  }),
  
}
);

export const { useGetDevicesByClientIdQuery, useGetDeviceDatabyDeviceIdQuery,useReadDeviceByDeviceIdQuery,useGetHistoricalDeviceDatabyDeviceIdQuery } = deviceApi;