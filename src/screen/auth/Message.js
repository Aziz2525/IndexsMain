import React, { useState, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import socket from "../../../socket";
import messagePost from "../../api/messagePost";
import * as SecureStore from "expo-secure-store";
import messageGet from "../../api/messageGet";

const Message = ({ route }) => {
  const scrollViewRef = useRef();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [toMessageId, setToMessageId] = useState([]);
  const [me,setMe]=useState('')
  const sendMessageUserToken = route.params.userToken;
  socket.emit("get all list", sendMessageUserToken);

  socket.on("get all list emit", (res) => {
      setToMessageId(res[0]._id)
  });
 
  React.useEffect(()=>{
   
      var bootstrap = async() =>{
        socket.on("get message",(res)=>{
          setMessages((messages) => [...messages, { message:res.message,from:res.userToken }]);
        })
          var from = await SecureStore.getItemAsync('userToken');
          setMe(from)
          messageGet(sendMessageUserToken,from).then((res)=>{
              setMessages(res[0].messages)
          })
      }
      bootstrap()
    
  },[])
  const send = async () => {
    var from = await SecureStore.getItemAsync('userToken');
    socket.emit('send message',{message,toMessageId,from})
    messagePost(sendMessageUserToken,from,message)
    setMessages((messages) => [...messages, { message, from: from }]);
    setMessage("");
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={70}
    >
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map((data, index) => {
          if (data.from === me)
            return (
              <View style={styles.messagesRightView} key={index}>
                <View></View>
                <View style={styles.messagesRightContentView}>
                  <Text style={styles.messageRightText}>{data.message}</Text>
                </View>
              </View>
            );
          else
            return (
              <View style={styles.messagesLeftView} key={index}>
                <View style={styles.messageLeftContentView}>
                  <Text style={styles.messageLeftText}>{data.message}</Text>
                </View>
              </View>
            );
        })}
    
      </ScrollView>
      <View style={styles.writeView}>
        <View style={styles.writeViewContainer}>
          <TextInput
            style={styles.writeText}
            multiline={true}
            onChangeText={(e) => setMessage(e)}
            value={message}
          />
          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: message.length > 0 ? "#4164C1" : "#E3E3E3" },
            ]}
            onPress={() => send()}
          >
            <Feather
              name="send"
              size={20}
              color={message.length > 0 ? "white" : "#3E3F42"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F8F8",
  },
  writeView: {
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  writeViewContainer: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 30,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  writeText: {
    height: 35,
    flex: 1,
  },
  btn: {
    backgroundColor: "#4164C1",
    padding: 7,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesRightView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  messagesRightContentView: {
    backgroundColor: "#4164C1",
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginRight: 10,
    maxWidth: "90%",
  },
  messageRightText: {
    color: "white",
  },
  messagesLeftView: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageLeftContentView: {
    backgroundColor: "#E3E3E3",
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: 10,
    maxWidth: "90%",
  },
  messageLeftText: {},
});
