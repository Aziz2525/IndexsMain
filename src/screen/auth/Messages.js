import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Bubble from '../../components/Bubble'
import Toast from 'react-native-toast-message';
import socket from '../../../socket';
import { Audio } from 'expo-av';
import * as SecureStore from "expo-secure-store";
import messagesGet from '../../api/messagesGet';
const Messages =  ({navigation}) => {
    const [messages,setMessages] = React.useState([])
    const [lastMessage,setLastMessage] =React.useState(null);
    const [me,setMe] = React.useState('')
    React.useEffect(()=>{
        var bootstrap = async() =>{
            var from = await SecureStore.getItemAsync('userToken');
            setMe(from)
            messagesGet(from).then((res)=>{
                setMessages(res)
            })
            socket.on('get message',async (res)=>{
                setLastMessage(res.message)
                 
                Toast.show({
                    position:'top',
                    type: 'success',
                    text1: 'Aziz Kurt',
                    text2: res.message
                  });
                 
            })
          }
          bootstrap()
        
     
    },[])
  
    return (
        <>
        <ScrollView contentContainerStyle={styles.contentContainerStyle} style={styles.container}>
            {
                messages.map((data,index)=>{
                    return(
                        <Bubble key={index} onPress={()=>navigation.push('Message',{name:data.to === me ? data.fromUser[0].username:data.toUser[0].username,userToken:data.to === me ? data.from:data.to,image:data.to === me ? data.fromUser[0].userdetails ? data.fromUser[0].userdetails.profileImage:"default":data.toUser[0].userdetails?data.toUser[0].userdetails.profileImage:"default" })} navigation={navigation} image={data.to === me ? data.fromUser[0].userdetails ? data.fromUser[0].userdetails.profileImage:"default":data.toUser[0].userdetails?data.toUser[0].userdetails.profileImage:"default" } name={data.to === me ? data.fromUser[0].username:data.toUser[0].username}  ago={"1 dk önce"} badge={1} text={lastMessage ? lastMessage: data.messages[data.messages.length-1].message}/>
                    )
                })
            }
        
        </ScrollView>
        

        </>
    )
}

export default Messages

const styles = StyleSheet.create({
    contentContainerStyle:{
        backgroundColor:'#F9F8F8'
    },
    container:{
        backgroundColor:'#F9F8F8'
    }
})
