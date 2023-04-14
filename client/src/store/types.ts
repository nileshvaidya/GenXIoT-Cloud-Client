export interface Message {
  id: string;
  data: string;
  lastUpdated: number;
}

export interface Store{
  message: Message;
  newMessage: string;
}