import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import SocketProvider from "./context/socket.context";
import { Provider } from "react-redux";
//import store from "./store/store";
import { deviceStore } from "./store/deviceStore";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext, socket } from './context/socket';
import { StyledEngineProvider } from '@mui/material/styles';
import SocketContextComponent from "./context/Socket/Component";
const container = document.getElementById("root");
const root = createRoot(container!);


root.render(
  <Provider store={deviceStore}>
    <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <SocketContextComponent>
        <App />
        </SocketContextComponent>
        </StyledEngineProvider>
    </React.StrictMode>
  </Provider>
);
