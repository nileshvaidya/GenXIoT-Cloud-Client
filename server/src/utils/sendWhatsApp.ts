import twilio from 'twilio';


const TWILIO_ACCOUNT_SID = 'AC5e9334c410e1929fc7fd3d1a6e12e64a';
const TWILIO_AUTH_TOKEN = '0781be7f1a5dcd56a46c7cfac52cd6b9';
let msg = '';
export const sendWhatsAppMsg: any = (sendTo: string,paramType: string, param:string, msgType: string, val: number, type : string, limit : number) => {
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  console.log("sendTo : ", sendTo , "   " ,'paramType : ', paramType, '   ' , 'param : ', param , '   ', 'msgType : ', msgType, '   ', 'type : ', type );
  
  if (msgType == 'alerts') {
    if (paramType == 'analog') {
      if (type == 'high') {
        msg = `💣 *ALERTS* 💣 --- Param ${param} 's Value : ${val} has crossed the *set Higher Limit of ${limit}. Kindly take appropriate action immediately.* 🔥 🔥 🔥`;

      }
      if (type == 'low') {
        msg = `💣 *ALERTS* 💣 --- Param ${param} 's Value : ${val} has crossed the *set Ligher Limit of ${limit}. Kindly take appropriate action immediately.* 🔥 🔥 🔥`;

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
        msg = `⏰ *ALARM* ⏰ --- Param ${param} 's Value : ${val} has crossed the *set Ligher Limit of ${limit}. Kindly take appropriate action immediately.* 🚀 🚀 🚀`;

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
  let to = 'whatsapp:' + sendTo;
  console.log(to);
  
  client.messages.create({
    from: 'whatsapp:+14155238886',
    to: to,
    body: msg
  }).then(message => console.log(message.sid))
    .catch(error => console.error(error));


  }

