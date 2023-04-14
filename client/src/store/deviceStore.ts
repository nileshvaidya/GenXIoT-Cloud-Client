import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { deviceApi } from "../services/device/device";
import  deviceSlice  from "../services/device/deviceSlice";

export const deviceStore = configureStore({
  reducer: {
    [deviceApi.reducerPath]: deviceApi.reducer,
    deviceSlice: deviceSlice,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(deviceApi.middleware),
})

setupListeners(deviceStore.dispatch)

export type RootState = ReturnType<typeof deviceStore.getState>

export type AppDispatch = typeof deviceStore.dispatch