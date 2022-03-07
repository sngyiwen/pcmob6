import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { API, API_WHOAMI } from "../constants/API";
import { changeModeAction } from "../redux/ducks/accountPref";
import { logOutAction } from "../redux/ducks/blogAuth";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
// import { lightModeAction, darkModeAction } from "../redux/ducks/accountPref";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState(null);
  const picSize = new Animated.Value(0);
  const sizeInterpolation = {
    inputRange: [0, 0.5, 1],
    outputRange: [200, 300, 200],
  }

  // const styles = { ...commonStyles, ...lightStyles };
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const profilePicture = useSelector(
    (state) => state.accountPrefs.profilePicture
  );
  const dispatch = useDispatch();

  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  async function getUsername() {
    console.log("---- Getting user name ----");
    // const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      setUsername(response.data.username);
    } catch (error) {
      console.log("Error getting user name");
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data.status_code === 401) {
          signOut();
          navigation.navigate("SignInSignUp");
        }
      } else {
        console.log(error);
      }
      // We should probably go back to the login screen???
    }
  }

function changePicSize() {
  Animated.loop(
    Animated.sequence([
      Animated.timing(picSize,{
        toValue: 1,
        duration: 2500,
        useNativeDriver: false
      }),
      Animated.timing(picSize, {
        toValue: 200,
        duration: 2500,
        useNativeDriver: false
      })
    ])
  ).start()

  // Animated.spring(picSize, {
  //   toValue: 300,
  //   duration: 2500,
  //   useNativeDriver: false
  // }).start();
 
}

  function signOut() {
    // AsyncStorage.removeItem("token");
    dispatch(logOutAction());
    navigation.navigate("SignInSignUp");
  }

  function switchMode() {
    // dispatch(isDark ? lightModeAction() : darkModeAction());
    dispatch(changeModeAction());
  }

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator />);
      getUsername();
    });
    getUsername();
    return removeListener;
  }, []);

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={[styles.title, styles.text, { margin: 30 }]}> Hello {username} !</Text>
      {profilePicture == null ? <View /> :
        <TouchableWithoutFeedback onPress={changePicSize}>
          <Animated.Image style={{ width: picSize.interpolate(sizeInterpolation), height: picSize.interpolate(sizeInterpolation), borderRadius: 200 }} source={{ uri: profilePicture?.uri }} />
        </TouchableWithoutFeedback>
      }
      <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
          <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}> No profile picture. Click to take one. </Text>
          </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 20}}>
        <Text style={[styles.content, styles.text]}> Dark Mode? </Text>
        <Switch
          value={isDark}
          onChange={switchMode}/>
      </View>
      <TouchableOpacity style={[styles.button]} onPress={signOut}>
        <Text style={styles.buttonText}>
          Sign Out
        </Text>
        </TouchableOpacity>
    </View>
  );
}
