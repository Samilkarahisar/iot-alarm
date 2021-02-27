
import React from 'react';
import { StyleSheet, Text, SafeAreaView,View} from 'react-native';
import Background from "../components/Background";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import {Power,Battery} from "react-native-feather";
import { db } from "../core/config";

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import firebase from "firebase";

async function registerForPushNotificationsAsync() {
    const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }
  
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
  
    return token;
  }

  function listNotifications (list){
    var Arr = [];
    list.map((objet, i)=> {
        
    var h = new Date(objet.date).getHours();
    var m = new Date(objet.date).getMinutes();
   let mstring = m.toString();
   if(mstring.length<2){
       mstring = "0"+mstring;
   }
        Arr.push( <View key={i} style={{flexDirection:'column', width:350,backgroundColor:"#414757",
            borderWidth: 0,
            borderTopLeftRadius:20,
            borderTopRightRadius:20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,borderColor:"#414757",padding:15,margin: 6}}><Text style={{marginBottom: 10, color:"#F3EFF5",  fontWeight: "bold",
            fontSize: 15}}>{h}h{mstring}</Text><Text style={{color:"#F3EFF5"}}>{objet.body}</Text></View>);
    });
    return Arr.reverse();
}
const ProfileScreen = ({navigation}) => {
  
    const [notifPushToken, setNotifPushToken] = React.useState("");
    const [notificationMessages, setNotificationMessages] = React.useState([]);
    React.useEffect(() => {

        registerForPushNotificationsAsync().then(token => {
            
            setNotifPushToken(token.data);
 
            var database = db.ref().child("/notifications")
            database.child("/").on("value",  querySnapShot => {
             let data = querySnapShot.val() ? querySnapShot.val() : {};
             
             let items = {...data};
            
             let array= [];
             Object.entries(items).forEach(entry => {
                 
                 var timestamp = entry[1].date;
                 var today = new Date().setHours(0, 0, 0, 0);
                 var thatDay = new Date(timestamp).setHours(0, 0, 0, 0);  
               
                 if(today === thatDay && entry[1].to === notifPushToken){
                    
                     array.push(entry[1]);
                 }
              });
    
            setNotificationMessages(array);
        
        });
   
        
       });

    },[notifPushToken]);


    return(
        <Background>
            <Header>Historique des notifs</Header>
           {listNotifications(notificationMessages)}
           
    <Button mode="outlined" onPress={() => firebase.auth().signOut().then(()=>{navigation.navigate("Auth")})}>
      Déconnexion
    </Button>
        </Background>);
}
export default ProfileScreen;