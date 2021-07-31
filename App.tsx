import React, { useState } from "react";
import { useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";

export default function App() {
  const [token, setToken] = useState("");

  // getting push notification permission
  useEffect(() => {
    messaging().requestPermission();
  }, []);

  useEffect(() => {
    // get the device token on app load
    messaging()
      .getToken()
      .then((token) => {
        setToken(token);
      });

    // Setup a listener so that if the token is refreshed while the
    // app is in memory we get the updated token.
    return messaging().onTokenRefresh((token) => {
      setToken(token);
    });
  }, []);

  // handling foreground notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage = {}) => {
      const notification = remoteMessage.notification || {};
      const title = notification.title;
      const body = notification.body;
      if (title) {
        Alert.alert(title, body);
      }
    });

    return unsubscribe;
  }, []);

  // send the notification
  const sendNotification = async () => {
    Alert.alert(
      "Notification sent",
      "The destination will receive the notification"
    );
    try {
      await axios.post(
        "https://9d9gmb4jmd.execute-api.us-east-1.amazonaws.com/dev/",
        { token }
      );
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headText}>Push Notification Demo</Text>
      <View style={styles.textContainer}>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Token:</Text> {token}
        </Text>
        <TouchableOpacity onPress={sendNotification}>
          <View style={styles.buttonContainer}>
            <Text>Send Notification</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight + 20 : 60,
  },
  headText: {
    fontWeight: "bold",
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  buttonContainer: {
    backgroundColor: "beige",
    width: "100%",
    padding: 15,
    borderRadius: 5,
    marginTop: 60,
  },
});
