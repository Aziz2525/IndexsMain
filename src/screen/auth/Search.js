import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Image } from 'react-native-animatable';
import usersSearchFind from '../../api/usersSearchFind';
import { Ionicons, Feather } from "@expo/vector-icons";

const Search = ({navigation}) => {
    const [searchText,setSearchText] =useState('');
    const [searchList,setSearchList] = useState([])
    const searchF = (e) =>{
        if(e.length>0)
            usersSearchFind(e).then((res)=>{
                setSearchList(res)
            })
        else
            setSearchList([])
    }
    return (
        <ScrollView contentContainerStyle={styles.contentContainerStyle} container={styles.container}>
            <View style={styles.searchView}>
                <View style={styles.searchViewContainer}>
                    <Ionicons name="ios-search" style={styles.searchIcon} size={20} color={'gray'} />
                    <TextInput style={styles.search} placeholder="Kişi veya Grup Ara" onChangeText={(e)=>searchF(e)} />
                </View>
                
           
            {
                searchList.map((data,index)=>{
                    return(
                        <View style={styles.searchList} key={index}>
                            <TouchableOpacity  style={styles.searchListContainer} onPress={()=>navigation.push('Message',{userToken:data.fid,name:data.username,image:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'})}>
                                <View style={styles.profileImageView}>
                                    <Image style={styles.profileImage} source={{uri:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}} />
                                </View>
                                <Text style={styles.usernameText}>{data.username}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })
            }
             </View>
        </ScrollView>
    )
}

export default Search

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#F9F8F8',
    },
    contentContainerStyle:{
        backgroundColor:'#F9F8F8',
        flex:1
    },
    searchView:{
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
    },
    searchViewContainer:{
        width:'90%',
        flexDirection:'row',
        backgroundColor:'#EBE9E9',
        alignItems:'center'

    },
    search:{
        width:'90%',
        padding:15,
        borderRadius:5
    },
    searchList:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        marginTop:20,
        justifyContent:'center',
        alignItems:'center',
        
    },  
    searchIcon:{
        marginLeft:10
    },  
    searchListContainer:{
        width:'90%',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        padding:5,
        borderRadius:4,
        borderBottomColor:'#F9F8F8',
        borderBottomWidth:1,
    },  
    profileImageView:{
        width:50,
        height:50,
        borderRadius:25,
        overflow:'hidden'
    },
    profileImage:{
        width:50,
        height:50
    },
    usernameText:{
        marginLeft:20,
        fontWeight:'600'
    }
})
