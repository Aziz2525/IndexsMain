import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import usersTokenFind from "../../api/usersTokenFind";
import usersUpdatePost from "../../api/usersUpdatePost";

const Settings = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState([]);
  const [image, setImage] = useState(null);
  const [imageDetail, setImageDetail] = useState(null);
  const [username, setUsername] = useState(null);
  React.useEffect(() => {
    var bootstrap = async () => {
      var from = await SecureStore.getItemAsync("userToken");
      usersTokenFind(from).then((res) => {
        setUserInfo(res[0]);
        setUsername(res[0].username);
      });
    };
    bootstrap();
  }, []);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
      changeNavigator(true,result);
    }
  };
  const updateImage = async (result) => {
    var from = await SecureStore.getItemAsync("userToken");
    usersUpdatePost(result, username,from);
  };
  const changeNavigator = (isUpdate,result) => {
    if (isUpdate) {
      navigation.setOptions({
        headerRight: () => {
          return (
            <TouchableOpacity onPress={() => updateImage(result)}>
              <Feather
                name="check"
                size={25}
                color="#4164C1"
                style={{ marginRight: 5 }}
              />
            </TouchableOpacity>
          );
        },
        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => changeNavigator(false)}>
              <Text style={styles.headerLeftText}>Vazgeç</Text>
            </TouchableOpacity>
          );
        },
      });
    } else {
      navigation.setOptions({
        headerRight: null,
        headerLeft: null,
      });
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      <View style={styles.imageHeader}>
        <TouchableOpacity style={styles.profileImageView} onPress={pickImage}>
          <Image
            source={
              !image
                ? userInfo.image
                  ? { uri: userInfo.image }
                  : require("../../../assets/defaultimage.png")
                : { uri: image }
            }
            style={styles.image}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.username}>
          <View style={styles.usernameView}>
            <Text style={styles.usernameText}>Kullanıcı Adı</Text>
          </View>
          <TextInput
            onChangeText={(e) => setUsername(e)}
            value={username}
            style={styles.usernameInput}
            placeholder="Kullanıcı adı belirtin"
          />
        </View>
        <View style={styles.username}>
          <View style={styles.usernameView}>
            <Text style={styles.usernameText}>Telefon Numarası</Text>
          </View>
          <Text style={styles.usernameInput}>{userInfo.phoneNumber}</Text>
        </View>
      </View>
      <View style={styles.suspendView}>
        <TouchableOpacity style={styles.suspendBtn}>
          <Text style={styles.suspendText}>Hesabımı Askıya Al</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  contentContainerStyle: {
    backgroundColor: "#F9F8F8",
  },
  imageHeader: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  profileImageView: {
    width: 70,
    height: 70,
    overflow: "hidden",
    borderRadius: 50,
  },
  image: {
    width: 70,
    height: 70,
  },
  container: {
    backgroundColor: "white",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
  },
  username: {
    flexDirection: "row",
    padding: 15,
  },
  usernameView: {
    borderRightWidth: 2,
    borderColor: "#EEEDED",
    paddingRight: 10,
    width: "30%",
  },
  usernameText: {
    fontWeight: "700",
  },
  usernameInput: {
    marginLeft: 15,
  },
  suspendView: {
    padding: 20,
    backgroundColor: "transparent",
  },
  suspendBtn: {
    backgroundColor: "#4164C1",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 3,
  },
  suspendText: {
    color: "white",
    fontWeight: "700",
  },
  headerLeftText: {
    color: "#4164C1",
    fontSize: 17,
  },
});
