import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { API, API_POSTS } from "../constants/API";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getPathFromState } from "@react-navigation/native";

export default function ShowScreen({ navigation, route }) {
  const [post, setPost] = useState({ title: "", content: "" });
  // const styles = { ...lightStyles, ...commonStyles };
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={editPost} style={{ marginRight: 10 }}>
          <FontAwesome
            name="pencil-square-o"
            size={30}
            color={styles.headerTint}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    getPost();
  }, []);

  async function getPost() {
    // const token = await AsyncStorage.getItem("token");
    const id = route.params.id;
    console.log(id);
    try {
      const response = await axios.get(API + API_POSTS + "/" + id, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      setPost(response.data);
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  function editPost() {
    navigation.navigate("Edit");
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.text, { margin: 40 }]}>
        {post.title}
      </Text>
      <Text style={[styles.content, styles.text, { margin: 20 }]}>
        {post.content}
      </Text>
    </View>
  );
}
