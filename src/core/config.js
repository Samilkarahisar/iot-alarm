// Replace with your own firebase config!
import Firebase from "firebase";

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCVbm-9nvco22ueO97ERin8McLaX6BtEwY",
  authDomain: "https://iot-alarm-9b18a.firebaseio.com",
  databaseURL: "https://iot-alarm-9b18a-default-rtdb.firebaseio.com/",
  projectId: "iot-alarm-9b18a",
  storageBucket: "iot-alarm-9b18a.appspot.com",
  messagingSenderId: "184039573598",
  appId: "1:184039573598:ios:c597ab6f929d65bff08ccf",
};

const app = Firebase.initializeApp(FIREBASE_CONFIG);
export const db = app.database();