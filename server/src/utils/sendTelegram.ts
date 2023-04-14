import TelegramBot from 'node-telegram-bot-api';

const apiToken = '6279777851:AAG0UO6-iRmt5JZTvuwbgd82pP3hVQQMmuU';
const bot = new TelegramBot(apiToken, { polling: false });

let msg = '';

interface Client {
  name: string;
  phone: string;
  chatId: number;
}
const clients: Client[] = [
  {
    name: 'Nilesh',
    phone: '+91887575913',
    chatId: 408339003,
  },
  {
    name: 'Aditya',
    phone: '+1111111111',
    chatId: 6268255389,

  },
  {
    name: 'Sandip',
    phone: '+9987585914',
    chatId: 375871884,
  },
  {
    name: 'Nikhil',
    phone: '+919833012272',
    chatId: 394709538,
  },
  {
    name: 'Lalit',
    phone: '+917719972982',
    chatId: 5883171510,
  },
  {
    name: 'Mayur',
    phone: '+9192847383932',
    chatId: 6110618946,
  },
  {
    name: 'Bhushan',
    phone: '+917767935893',
    chatId: 6093051997,
  },
  {
    name: 'Rajesh',
    phone: '+919823517437',
    chatId: 6007491589,
  }
];



export const sendTelegramMsg: any = (sendTo: string,paramType: string, param:string, msgType: string, val: number, type : string, limit : number) => {
 
  console.log("sendTo : ", sendTo , "   " ,'paramType : ', paramType, '   ' , 'param : ', param , '   ', 'msgType : ', msgType, '   ', 'type : ', type );
  
  if (msgType == 'alerts') {
    if (paramType == 'analog') {
      if (type == 'high') {
        msg = `💣 *ALERTS* 💣 --- Param ${param} 's Value : ${val} has crossed the *set Higher Limit of ${limit}. Kindly take appropriate action immediately.* 🔥 🔥 🔥`;

      }
      if (type == 'low') {
        msg = `💣 *ALERTS* 💣 --- Param ${param} 's Value : ${val} has crossed the *set Higher Limit of ${limit}. Kindly take appropriate action immediately.* 🔥 🔥 🔥`;

      }
    }
    if (paramType == 'digital') {
      if (type == 'high') {
        msg = `💣 *ALERTS* 💣 --- Param ${param} 's Value *HIGH* which is *critical according to settings. Kindly take appropriate action immediately.* 🔥 🔥 🔥`;

      }
      if (type == 'low') {
        msg = `💣 *ALERTS* 💣 --- Param ${param} 's Value *LOW* which is *critical according to settings. Kindly take appropriate action immediately.* 🔥 🔥 🔥`;

      }
    }


    }
  if (msgType == 'alarms') {
    if (paramType == 'analog') {
      if (type == 'high') {
        msg = `⏰ *ALARM* ⏰ --- Param ${param} 's Value : ${val} has crossed the *set Higher Limit of ${limit}. Kindly take appropriate action immediately.* 🚀 🚀 🚀`;

      }
      if (type == 'low') {
        msg = `⏰ *ALARM* ⏰ --- Param ${param} 's Value : ${val} has crossed the *set Higher Limit of ${limit}. Kindly take appropriate action immediately.* 🚀 🚀 🚀`;

      }
    }
    if (paramType == 'digital') {
      if (type == 'high') {
        msg = `⏰ *ALARM* ⏰ --- Param ${param} 's Value *HIGH* which is *critical according to settings. Kindly take appropriate action immediately.* 🚀 🚀 🚀`;

      }
      if (type == 'low') {
        msg = `⏰ *ALARM* ⏰ --- Param ${param} 's Value *LOW* which is *critical according to settings. Kindly take appropriate action immediately.* 🚀 🚀 🚀`;

      }
    }


  }
  
  if (!msg) {
    msg = "*Some param missing!!!*"
  }
  console.log(msg);
  sendAlerts(msg);
  }
  async function sendAlerts(message: string) {
    for (const client of clients) {
      try {
        const sentMessage = await bot.sendMessage(client.chatId, message);
        console.log(`Alert sent to client ${client.name}: ${sentMessage.text}`);
      } catch (err: any) {
        console.error(`Error sending alert to client ${client.name}: ${err.message}`);
      }
    }
  }
