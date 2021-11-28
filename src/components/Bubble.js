import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "react-native-animatable";

const Bubble = (props) => {
  return (
    <TouchableOpacity {...props} style={styles.bubbleViewContainer} >
      <View style={styles.outBubble}>
        <View style={styles.bubbleView}>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={{
                uri: props.image,
              }}
            />
          </View>
          <View style={styles.contentMessage}>
              <Text style={styles.name}>{props.name}</Text>
              <Text style={styles.text}>{props.text}</Text>
          </View>
        </View>
        <View style={styles.contentRight}>
            <Text style={styles.ago}>{props.ago}</Text>
            <View style={styles.badge}>
                <Text style={styles.agoText}>{props.badge}</Text>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default Bubble;
const styles = StyleSheet.create({
  bubbleViewContainer: {
    width: "100%",
    padding: 20,
    backgroundColor:'white',
    borderBottomWidth:1,
    borderBottomColor:'#F9F8F8'
  },
  outBubble: {
      flex:1,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bubbleView: {
    flexDirection: "row",
    flex:1
  },
  imageView: {
    width: 55,
    height: 55,
    borderRadius: 75,
    overflow: "hidden",
  },
  image: {
    width: 55,
    height: 55,
  },
  contentMessage:{
      marginLeft:10,
      flexWrap:'nowrap',
  },
  name:{
      fontSize:15,
      fontWeight:'600'
  },
  text:{
      fontSize:14,
      marginTop:5
  },
  ago:{
      color:'#999292'
  },
  contentRight:{
      flexDirection:'column',
      justifyContent:'space-between',
      textAlignVertical:'auto',
      direction:'rtl'
  },
  badge:{
      width:20,
      height:20,
      backgroundColor:'#4164C1',
      borderRadius:20,
      justifyContent:'center',
      alignItems:'center',
  },
  agoText:{
      color:'white',
      fontWeight:'700',
      fontSize:11
  }
});
