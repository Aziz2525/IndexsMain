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
            console.log(from)
            messagesGet(from).then((res)=>{
                console.log(res)
                setMessages(res)
            })
            socket.on('get message',async (res)=>{
                setLastMessage(res.message)
                const { sound } = await Audio.Sound.createAsync(
                    require('../../../assets/getmessage1.wav')
                 );
                 await sound.playAsync();
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
                        <Bubble key={index} onPress={()=>navigation.push('Message',{userToken:data.to === me ? data.from:data.to,name:data.to,image:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'})} navigation={navigation} image="https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?size=626&ext=jpg" name={data.to === me ? data.from:data.to}  ago={"1 dk önce"} badge={1} text={lastMessage ? lastMessage: data.messages[data.messages.length-1].message}/>
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
