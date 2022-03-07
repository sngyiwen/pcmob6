// import React, { useState, useEffect } from "react";
// import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import { Provider, useSelector } from "react-redux";
import LoggedInTabStack from "./components/LoggedInTabStack";
import store from "./redux/configureStore";
import SignInSignUpScreen from "./screens/SignInSignUpScreen";

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import SignInSignUpScreen from "./screens/SignInSignUpScreen";

const Stack = createStackNavigator();

// export default function App() {
//   const [loading, setLoading] = useState(true);
//   const [signedIn, setSignedIn] = useState(false);

//   async function loadToken() {
//     const token = await AsyncStorage.getItem("token");
//     if (token) {
//       setSignedIn(true);
//     }
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadToken();
//   }, []);

//   return loading ? (
//     <View style={styles.container}>
//       <ActivityIndicator />
//     </View>
//   ) : (
function App() {
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  console.log(token);
  return (
    <NavigationContainer>
    <StatusBar style = { isDark ? "light" : "dark" } />
      <Stack.Navigator
        mode="modal"
        headerMode="none"
        initialRouteName={token != null ? "Logged In" : "SignInSignUp"}
        animationEnabled={false}
      >
        <Stack.Screen component={SignInSignUpScreen} name="SignInSignUp" />
        <Stack.Screen component={LoggedInTabStack} name="Logged In" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
