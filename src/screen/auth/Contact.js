import React ,{useEffect,useState} from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import * as Contacts from 'expo-contacts';
const Contact = () => {
    const [myContact,setMyContact] = useState([])
    useEffect(() => {
        (async () => {
          const { status } = await Contacts.requestPermissionsAsync();
          if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
              fields: [Contacts.Fields.PhoneNumbers],
            });
    
            if (data.length > 0) {
              setMyContact(data)
            }
          }
        })();
      }, []);
    return (
        <ScrollView contentContainerStyle={{backgroundColor:'white',padding:10}}>
            {
                myContact.map((data,index)=>{
                    return(
                        <View style={styles.column} key={index}>
                            <View style={styles.imageView}>
                                <Image source={require('../../../assets/defaultimage.png')} style={styles.image} />
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.name}>{data.name}</Text>
                                <Text style={styles.phone}>{data.phoneNumbers?data.phoneNumbers[0].digits:null}</Text>
                            </View>
                        </View>
                    )
                })
            }
        </ScrollView>
    )
}

export default Contact

const styles = StyleSheet.create({
    column:{
        flexDirection:'row',
        marginBottom:15
    },
    imageView:{
        width:50,
        height:50,
        borderRadius:25,
        overflow:'hidden'
    },
    image:{
        width:50,
        height:50
    },
    name:{
        fontSize:18,
        fontWeight:'600',
        marginLeft:10
    },
    phone:{
        marginLeft:10
    }
})
