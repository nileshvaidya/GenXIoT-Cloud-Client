import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react'
import { useSocket } from '../../hooks/useSocket';
import { defaultSocketContextState, SocketStateContextProvider } from './ContextState';
import { SocketDispatchContextProvider, SocketReducer } from './ContextDispatch';

const client_Id = 'SBF0001';

export interface ISocketContextComponentProps extends PropsWithChildren{
  // children?: React.ReactNode;
  // device_ID?: string;
  // AddDeviceToSocket?: () => void;
  // RemoveDeviceFromSocket?: () => void;
}
// export type SocketContextComponentProps = {
//   children?: React.ReactNode;
//   device_ID?: string;
//   AddDeviceToSocket?: () => void;
//   RemoveDeviceFromSocket?: () => void;
// }
const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {

  const { children } = props;

  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
  const [loading, setLoading] = useState(true);
  const [device_Id, setDevice_Id] = useState("");

  const socket = useSocket("ws://localhost:8080", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false
  });

  useEffect(() => {
    /** Connect to the Web Socket */
    socket.connect();

    /** Save the socket in context */
    SocketDispatch({ type: 'update_socket', payload: socket });
    /** Start the event listeners */
    StartListeners();
    /** Send the handshake */
    SendHandshake();
    /** Add to Client List */
    AddToClient(client_Id);

    // eslint-disable-next-line
  }, []);

  const StartListeners = () => {

    /**User connected */
    socket.on('user_connected', (users: string[]) => {
      console.info('User connected.');
      SocketDispatch({ type: 'update_users', payload: users });
    });

    /**User Disconnected event */
    socket.on('user_disconnected', (uid: string) => {
      console.info('User disconnected, new user list received.');
      SocketDispatch({ type: 'remove_user', payload: uid });
    });
    /**Reconnet event */
    socket.io.on('reconnect', (attempt) => {
      console.info('Reconnected on attempt: ' + attempt);
    });
    /**Reconnet attempt event */
    socket.io.on('reconnect_attempt', (attempt) => {
      console.info('Reconnection attempt: ' + attempt);
    });
    /**Reconnetion error */
    socket.io.on('reconnect_error', (error) => {
      console.info('Reconnection error: ' + error);
    });
    /**Reconnetion failed */
    socket.io.on('reconnect_failed', () => {
      console.info('Reconnection failure');
      alert('We are unable to connect you to the web socket.');
    });

    /**Device Data received */
    // socket.on('device_data', () => {
    //   console.info('Reconnection failure');
    //   alert('We are unable to connect you to the web socket.');
    // });

   };
  const SendHandshake = () => {
    console.log('Sending handshake to server ...');

    socket.emit('handshake', (uid: string, users: string[]) => {
      console.log('User handshake callback message received');
      SocketDispatch({ type: 'update_uid', payload: uid });
      SocketDispatch({ type: 'update_users', payload: users });

      setLoading(false);
      
    })
    
  };
  
  const AddToClient = (clientId:string) => {
    console.log('Request to add Client to Client List...');

    socket.emit('add_client', client_Id, (res: string) => {
      console.log(res);
    });
  }

  const handleClick = () => {
    const input = document.getElementById('deviceId') as HTMLInputElement | null;

    const value = input?.value;
    // console.log(value) // 👉️ "Initial value"

    console.log('Request to add Device to Device List...');
    socket.emit('add_device', value, (res: string) => {
      console.log(res);
    })
   
  }

  const AddDeviceToSocket = (device_Id:string) => {
    setDevice_Id(device_Id);
    console.log('Request to add Device to Device List...');
    socket.emit('add_device', device_Id, (res: string) => {
      console.log(res);
    })
  }
  const handleDeRegisterClick = () => {
    const input = document.getElementById('deviceId') as HTMLInputElement | null;

    const value = input?.value;
    // console.log(value) // 👉️ "Initial value"

    console.log('Request to add Device to Device List...');
    socket.emit('remove_device',  (res: string) => {
      console.log(res);
    })
   
  }

  const RemoveDeviceFromSocket = () => {
    console.log('Request to add Device to Device List...');
    socket.emit('remove_device',  (res: string) => {
      console.log(res);
    })
  }

  if (loading) return <p>Loading Socket IO....</p>;


  return (
<div>
      <SocketStateContextProvider value={{ SocketState }}>
        <SocketDispatchContextProvider value = {{SocketDispatch, AddDeviceToSocket, RemoveDeviceFromSocket }}>
          {children}
          </SocketDispatchContextProvider>
      </SocketStateContextProvider>
      {/* <div>
        <input type="text" id='deviceId' />
        <button onClick={handleClick}>Register</button>
        <button onClick={handleDeRegisterClick}>De - Register</button>
</div> */}
    </div>
  )
 
 
};

export default SocketContextComponent;

