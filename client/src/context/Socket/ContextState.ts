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




export interface ISocketContextProps {
  SocketState: ISocketContextState;
  
}

const SocketStateContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
 
});

export const SocketStateContextConsumer = SocketStateContext.Consumer;
export const SocketStateContextProvider = SocketStateContext.Provider;

export default SocketStateContext;
