import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import firebase from "../../firebase";
const Login = ({ navigation }) => {
  const recaptchaVerifier = React.useRef(null);
  const [verificationId, setVerificationId] = React.useState();
  const firebaseConfig = firebase.apps.length
    ? firebase.app().options
    : undefined;
  const [message, showMessage] = React.useState(
    !firebaseConfig || Platform.OS === "web"
      ? {
          text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.",
        }
      : undefined
  );
  const attemptInvisibleVerification = false;
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const kodGonder = async () => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        formattedValue,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      navigation.push("Code", { verificationId });
      console.log("Verification code has been sent to your phone.");
      showMessage({
        text: "Verification code has been sent to your phone.",
      });
    } catch (err) {
      console.log({ text: `Error: ${err.message}`, color: "red" });
      showMessage({ text: `Error: ${err.message}`, color: "red" });
    }
  };
  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />
      <View style={styles.title}>
        <Text style={styles.titleText}>
          Lütfen oturum açacağınız telefon numarasını girin. Belirtilen telefon
          numarasına bir doğrulama kodu gönderilecektir.
        </Text>
      </View>
      <PhoneInput
        placeholder="Telefon Numarası"
        defaultValue={value}
        defaultCode="TR"
        layout="first"
        textContainerStyle={{
          backgroundColor: "white",
          borderRadius: 20,
          width: "90%",
        }}
        containerStyle={{
          backgroundColor: "white",
          borderRadius: 7,
          width: "90%",
          fontWeight: "bold",
        }}
        codeTextStyle={{ fontWeight: "bold" }}
        textInputStyle={{ fontWeight: "bold" }}
        onChangeText={(text) => {
          if (text.length == 10) setValid(true);
          else setValid(false);
          setValue(text);
        }}
        onChangeFormattedText={(text) => {
          setFormattedValue(text);
        }}
        withShadow={false}
        autoFocus
      />
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: valid ? "#4164C1" : "#E3E3E3" }]}
        onPress={() => kodGonder()}
      >
        <Text style={[styles.btnText, { color: valid ? "white" : "#3E3F42" }]}>
          KOD GÖNDER
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

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
  btn: {
    width: "90%",
    marginTop: 20,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 17,
  },
});
