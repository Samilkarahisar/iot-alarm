var admin = require('firebase-admin');


var serviceAccount = require("/home/samil/service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://iot-alarm-9b18a-default-rtdb.firebaseio.com/'
});


var db = admin.database();
var ref = db.ref();
var toSend;

ref.child("/notify").once("value", function(snapshot) {
toSend=snapshot.val();
callback();
});


var somePushTokens = [];
function callback(){

var somePush = Object.entries(toSend);


somePush.forEach(element =>{

somePushTokens.push(element[1]);
});

callback2();
}


const { Expo } = require('expo-server-sdk')

function callback2(){

let expo = new Expo();


let messages = [];
process.env.TZ = 'Europe/Paris'
var milliseconds = new Date().getTime();

for (let pushToken of somePushTokens) {

  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    continue;
  }


  messages.push({
    to: pushToken,
    sound: 'default',
    body: ' \ud83d\udea8 ALERTE: La température a dépassé la limite réglée !!',
    date: milliseconds
})
}


let chunks = expo.chunkPushNotifications(messages);
let tickets = [];
(async () => {
for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
})();

callback3(messages);
}

function callback3(mes){
console.log(mes);
mes.forEach(element =>{
ref.child("/notifications").push(element);
})
callback4();
}


function callback4(){
ref.child("/notify").set(null);
}