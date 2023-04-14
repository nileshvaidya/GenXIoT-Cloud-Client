import { Socket } from "socket.io-client";
import { createContext } from "react";

export interface ISocketContextState {
  socket: Socket | undefined;
  uid: string;
  users: string[];
  client_Id: string;
  device_Id: string;
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  uid: '',
  users: [],
  client_Id: '',
  device_Id:'',

};

export type TSocketContextActions = 'update_socket' | 'update_uid' | 'update_users' | 'remove_user' |
'add_client' |'add_device'|'remove_device'|'client_data' |'device_data';

export type TSocketContextPayload = string | string[] | Socket;

export interface ISocketContextActions {
  type: TSocketContextActions;
  payload: TSocketContextPayload
}

export const SocketReducer = (state: ISocketContextState, action: ISocketContextActions) => {
  console.log(`Message Received - Action : ${action.type} - Payload: `, action.payload);

  switch (action.type) {
    case 'update_socket':
      return { ...state, socket: action.payload as Socket }
    case 'update_uid':
      return { ...state, uid: action.payload as string }
    case 'update_users':
      return { ...state, users: action.payload as string[] }
    case 'remove_user':
      return { ...state, users: state.users.filter((uid) => uid !== (action.payload as string)) };
    case 'add_client':
      return { ...state, client_Id: action.payload as string };
    case 'add_device':
      return { ...state, device_Id: action.payload as string };
    case 'remove_device':
      return { ...state, deviceId: '' }
    case 'device_data':
      return { ...state, device_Id: action.payload as string };
    default:
      return { ...state };
  }
};

export interface ISocketContextProps {
  SocketState: ISocketContextState;
  SocketDispatch: React.Dispatch<ISocketContextActions>;
  AddDeviceToSocket?: (device_Id:string) => void;
  RemoveDeviceFromSocket?: () => void;
}

const SocketContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
  SocketDispatch: () => { },
  AddDeviceToSocket: (device_Id) => { },
  RemoveDeviceFromSocket: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
