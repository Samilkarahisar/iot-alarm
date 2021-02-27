import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {createBottomTabNavigator} from "react-navigation-tabs";
import Dashboard from '../screens/Dashboard';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from "../screens/RegisterScreen";
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

import {Icon} from 'react-native-elements';
const AppStack = createStackNavigator({ Home: Dashboard, Other: ProfileScreen });
const AuthStack = createStackNavigator({ SignIn: LoginScreen, Forgot: ForgotPasswordScreen, Register: RegisterScreen });


const Tab = createBottomTabNavigator({
   Home: {
    name:"Home",
    screen: Dashboard,
    navigationOptions: {
        tabBarLabel:"Maison",
        tabBarIcon: () => (
            <Icon  name='home' type="simple-line-icon" size={20} color="grey" />
        )
    }
  },
   Other: {
    name:"Profile",
    screen: ProfileScreen,
    navigationOptions: {
        tabBarLabel:"Profile",
        tabBarIcon: () => (
          <Icon  name='user' type="simple-line-icon" size={20} color="grey" />
        )
    }
  } });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: Tab,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);