import React from "react";
import { Provider } from "react-native-paper";
import { theme } from "./src/core/theme";
import AppNavigator from './src/navigation/AppNavigator'



const Main = () => (
  <Provider theme={theme}>
    <AppNavigator />
  </Provider>
);

export default Main;
