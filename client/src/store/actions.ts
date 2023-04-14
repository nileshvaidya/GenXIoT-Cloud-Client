import { Message } from "./types";

export const ADD_MESSAGE = "ADD_MESSAGE";
export const UPDATE_MESSAGE = "UPDATE_MESSAGE";
export const SET_MESSAGE = "SET_MESSAGE";

export type ActionTypes = 
  | { type: typeof ADD_MESSAGE; }
  | { type: typeof SET_MESSAGE; payload: string }
  | {
    type: typeof UPDATE_MESSAGE;
    payload: {
      id: string;
      data: string;
      lastUpdated: number;
    };
  }

export const addMessage = (): ActionTypes => ({ type: ADD_MESSAGE });
export const updateMessage = (id: string, data:string, lastUpdated:number): ActionTypes => ({
  type: UPDATE_MESSAGE,
  payload: {
    id,
    data,
    lastUpdated,
  },
    
});
  
export const setMessage = (data: string): ActionTypes => ({
  type: SET_MESSAGE,
  payload: 
    data,
    
  });
