const moment = require ( 'moment');
const mqtt = require('mqtt') 
require('dotenv').config() 



const clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4) 
const host = 'localhost';
const port = '1883';
const connectUrl = `mqtt://${host}:${port}`
console.log (connectUrl);
const client  = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'ask',
    password: 'info',
    reconnectPeriod: 1000,
  })

// console.log(process.env.BROKER_URL, 'client', clientId) 

const topicName = 'askdevicedata/8876859487' 
let cnt = 0;



client.on("connect",function(connack){   
   console.log("client connected", connack); 
   cnt++;
// on client connection publish messages to the topic on the server/broker  
  //let payload = {1: "Hello world", 2: "Welcome to the test connection",3: "No of times " + Math.random()} 
  
  let myVar = setInterval(function(){ sendData() }, 10000);

  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;

}
function getRandomPF (min, max) {
    return (Math.random() * (max - min + 1)) + min;
    
}

  function sendData()
  {
     
      cnt =Math.floor(Math.random() * 100);
      let payload1 = {1: "Hello world", 2: "Welcome to the test connection",3: "No of times - " + cnt} 
     
      let payload = {"SK":"RRRST778","DID":"8876859487","V1":getRandomInt(180,250),"V1_R":"N","V2":getRandomInt(180,250),"V2_R":"N",
      "V3":getRandomInt(180,250),"V3_R":"N","I1":getRandomInt(0,100),"I1_R":"N","I2":getRandomInt(0,100),"I2_R":"N",
      "I3":getRandomInt(0,100),"I3_R":"N","PF1":getRandomPF(0,1),"PF_R":"N","PF2":getRandomPF(0,1),"PF_R":"N","PF3":getRandomPF(0,1),
      "PF_R":"N","FREQ":getRandomPF(47,52),"FREQ_R":"N","MkWh":getRandomInt(0,400),"MkWh_R":"N","D0":0,"D0_R":"N","D1":getRandomInt(0,1),"D1_R":"N",
      "D2":getRandomInt(0,1),"D2_R":"N","D3":getRandomInt(0,1),"D3_R":"N","D4":getRandomInt(0,1),"D4_R":"N","D5":getRandomInt(0,1),"D5_R":"N",
    "timestamp":  moment().unix()}
   
   
   
   
   
      client.publish(topicName, JSON.stringify(payload), {qos: 1, retain: true}, (PacketCallback, err) =>  { 

        if(err) { 
            console.log(err, 'MQTT publish packet') 
        }
        else {
            console.log("Published " + cnt + " times");
        }
         
    }) 
 
  }



  //assuming messages comes in every 3 seconds to our server and we need to publish or process these messages 
 
  
}) 

client.on("error", function(err) { 
    console.log("Error: " + err) 
    if(err.code == "ENOTFOUND") { 
        console.log("Network error, make sure you have an active internet connection") 
    } 
}) 

client.on("close", function() { 
    console.log("Connection closed by client") 
}) 

client.on("reconnect", function() { 
    console.log("Client trying a reconnection") 
}) 

client.on("offline", function() { 
    console.log("Client is currently offline") 
})  