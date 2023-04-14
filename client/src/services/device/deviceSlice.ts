
import { ActionTypes } from './../../store/actions';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface DeviceState {
  deviceSlice: any;
  deviceApi: any;
  device_Ids:string[]
}

const initialState: DeviceState = {
  device_Ids: [],
  deviceApi: undefined,
  deviceSlice: undefined
}

export const deviceSlice = createSlice({
  name: 'devicelist',
  initialState,
  reducers: {
    addDevice: (state, action:PayloadAction<string>) => {

      state.device_Ids.push(action.payload)
    },
    removeDevice: (state, action: PayloadAction<string>) => {
      const index = state.device_Ids.indexOf(action.payload)
      if (index > -1) {
        state.device_Ids.splice(index,1)
      }
    
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { addDevice, removeDevice } = deviceSlice.actions

export default deviceSlice.reducer