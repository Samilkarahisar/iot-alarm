import firebase from "firebase";

require("firebase/firestore");
import React, { memo } from "react";

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import { StyleSheet, Text, View} from "react-native";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import { logoutUser } from "../api/auth-api";
import { SliderPicker } from 'react-native-slider-picker';
import NetInfo from '@react-native-community/netinfo';
import { db } from "../core/config";

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


const Dashboard = ({navigation}) => {

  const [notifPushToken, setNotifPushToken] = React.useState(undefined);
  
  const [houseInformation, setHouseInformation]  = React.useState({});
  const [chooseTemperature, setChooseTemperature] = React.useState("50");

  const [wifiName, setWifiName] = React.useState(undefined);
  
  (async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

  })();



  registerForPushNotificationsAsync().then(token => {
    setNotifPushToken(token.data);
  }); 

  NetInfo.fetch().then(state => {
    setWifiName(state.details.ssid);
  });

  const _onLoginPressed = async () => {

    houseInformation.temperaturelimit = chooseTemperature;
    if(houseInformation.tokenPushNotif == undefined|| houseInformation.tokenPushNotif == "" || houseInformation.tokenPushNotif != notifPushToken){
      houseInformation.tokenPushNotif = notifPushToken;
    }
    var database = db.ref().child("/devices")
    database.child(wifiName).set(houseInformation);
  };

  React.useEffect(() => {


      if(wifiName != undefined){
    

     var database = db.ref().child("/devices")
     database.child(wifiName).on("value", querySnapShot => {
      let data = querySnapShot.val() ? querySnapShot.val() : {};
      
      let items = {...data};

      if(items.temperaturelimit == undefined){
        items.temperaturelimit = chooseTemperature;
      }
      setHouseInformation(items);
    });

    
    }

  },[wifiName]);

  

  return (<Background>
    <Header>Votre maison</Header>
  <Text style={{fontSize:50}}>{houseInformation.temperature}°</Text>
  <Text style={{fontSize:20,padding:5,marginRight:150}}>Humidité: {houseInformation.humidity}%</Text>
  <Text style={{fontSize:16,padding:0,marginRight:150}}>Qualité de l'air: {houseInformation.airquality}mQ</Text>


    <Header  >Température Limite</Header>
    <SliderPicker 
          minLabel={'0'}
          midLabel={'50'}
          maxLabel={'100'}
          maxValue={100}ex
          defaultValue={10}

          callback={position => {
            setChooseTemperature(position)
          }}
          labelFontColor={"#6c7682"}
          labelFontWeight={'600'}
          showFill={true}
          fillColor={'red'}
          labelFontWeight={'bold'}
          showNumberScale={true}
          showSeparatorScale={true}
          buttonBackgroundColor={'#fff'}
          buttonBorderColor={"#6c7682"}
          buttonBorderWidth={1}
          scaleNumberFontWeight={'300'}
          buttonDimensionsPercentage={6}
          heightPercentage={1}
          widthPercentage={80}/>

<Text>Seuille de l'alarme: {chooseTemperature}</Text>



<Button  mode="contained" onPress={_onLoginPressed}>
       Enregistrer
      </Button>
  </Background>);
}


export default Dashboard;
