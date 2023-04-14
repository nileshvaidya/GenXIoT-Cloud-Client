const mqtt = require('mqtt') 
const clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4) 
const host = 'localhost';
const port = '1883';
const connectUrl = `mqtt://${host}:${port}`
const client  = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'ask',
    password: 'info',
    reconnectPeriod: 1000,
  })
const topicName = 'test/connection' 


// connect to same client and subscribe to same topic name  
client.on('connect', () => { 
    // can also accept objects in the form {'topic': qos} 
  client.subscribe(topicName, (err, granted) => { 
      if(err) { 
          console.log(err, 'err'); 
      } 
      console.log(granted, 'granted') 
  }) 
}) 


// on receive message event, log the message to the console 
client.on('message', (topic, message, packet) => { 
  console.log(packet, packet.payload.toString()); 
  if(topic === topicName) { 
   console.log(JSON.parse(message)); 
  } 
}) 
client.on("packetsend", (packet) => { 
    console.log(packet, 'packet2'); 
}) 