import { configureStore } from "@reduxjs/toolkit";
import { ActionTypes, SET_MESSAGE, UPDATE_MESSAGE } from './actions';
import { Message, Store } from "./types";
import {composeWithDevTools} from'redux-devtools-extension'
// Standard Interface and Functions
export const updateMessage = (messages: Message[], id: string, data: string, lastUpdated: number): Message[] =>
  messages.map((message) => ({
    ...message,
    data: message.id === id ? data : message.data,
    lastUpdated: message.id === id ? lastUpdated : message.lastUpdated,
  }));


// Redux implementation

function messageReducer(state: Store = {
  message: null,
    newMessage:""
}, action: ActionTypes) {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        message:action.payload
      }
    
    // case UPDATE_MESSAGE:
    //   return {
    //     ...state,
    //     message: updateMessage(state.message, action.payload.id,action.payload.data,action.payload.lastUpdated),
    //   }
  
    default:
      return state;
  }
}

// export function configureStore(history: History, initialState: RootState){
//   const composeEnhancers = composeWithDevTools({});
//   const router = routerMiddleware(history);
//   const logger = createLogger({collapsed: true});
 
//   return createStore(
//    reducers,
//    initialState,
//    composeEnhancers(
//     applyMiddleware(router, logger, thunk)
//    )
//   )
//  }
// export default store;