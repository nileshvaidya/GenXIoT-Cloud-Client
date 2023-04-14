import { IDeviceData } from "../../models/DeviceData";

export type DeviceDateContextType = {
  deviceData: IDeviceData[];
  actualData: {};
  getHistoricalDeviceDatabyDeviceId: (device_Id: string, minutes: Number) => Promise<void>;
  updateActualData: (data: object) => void;
}
