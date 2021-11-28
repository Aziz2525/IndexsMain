import React, { useRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import firebase from "../../firebase";
import * as Animatable from "react-native-animatable";
import AuthContext from "../components/AuthContext";
import * as SecureStore from 'expo-secure-store';
import usersPost from '../api/usersPost'
const Code = ({ navigation, route }) => {
  const authCode = route.params.verificationId;
  const [animationType, setAnimationType] = React.useState("slideInDown");
  const { signIn } = React.useContext(AuthContext);
  const verification = async (e) => {
    setAnimationType("");
    if (e.length == 6)
      try {
        const credential = firebase.auth.PhoneAuthProvider.credential(
          authCode,
          e
        );
        await firebase.auth().signInWithCredential(credential);
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user != null) {
                usersPost('',user.phoneNumber,user.uid).then(async(res)=>{
                  if(res.success)
                    await SecureStore.setItemAsync('userToken',user.uid)
                  else
                    await SecureStore.setItemAsync('userToken',user.uid)
                })
            }else{
              console.log('We are error now!');
            }
          });
        signIn();
      } catch (err) {
        setAnimationType("rubberBand");
        console.log(err);
      }
  };
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>
          Lütfen telefonunuza gönderilen 6 haneli kodu girin.
        </Text>
      </View>
      <View style={styles.codeContainer}>
        <Animatable.View
          style={styles.codeInput}
          animation={animationType}
          iterationCount={1}
          direction="alternate"
          useNativeDriver={true}
        >
          <TextInput
            style={styles.input}
            autoFocus
            maxLength={6}
            keyboardType="number-pad"
            onChangeText={(e) => verification(e)}
          />
        </Animatable.View>
      </View>
    </View>
  );
};

export default Code;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F9F8F8",
  },
  title: {
    width: "90%",
    marginBottom: 50,
    marginTop: 20,
  },
  titleText: {
    width: "100%",
    textAlign: "center",
    fontSize: 17,
  },
  codeContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  codeInput: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 20,
    width: "90%",
    borderRadius: 7,
  },
  input: {
    fontSize: 29,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
});
