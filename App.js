import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./src/screen/Login";
import Code from "./src/screen/Code";
import Messages from "./src/screen/auth/Messages";
import AuthContext from "./src/components/AuthContext";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import Message from "./src/screen/auth/Message";
import Settings from "./src/screen/auth/Settings";
import { Image } from "react-native-animatable";
import socket from "./socket";
import Search from "./src/screen/auth/Search";
import Toast from "react-native-toast-message";
import config from "./config";
import Contact from "./src/screen/auth/Contact";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        // await SecureStore.deleteItemAsync("userToken")
        userToken = await SecureStore.getItemAsync("userToken");
        socket.on("connect", (res) => {
          socket.emit("ready", { userToken });
        });
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );
  function Tabs() {
    return (
      <>
        <Tab.Navigator
          initialRouteName="Messagess"
          screenOptions={{
            tabBarActiveTintColor: "#4164C1",
            tabBarInactiveTintColor: "#3E3F42",
          }}
        >
          <Tab.Screen
            name="Messages"
            component={Messages}
            options={{
              title: "Durum",
              tabBarIcon: ({ color, size }) => {
                return <Feather name="bar-chart" size={26} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="Search"
            component={Search}
            options={{
              title: "Arama",
              tabBarIcon: ({ color, size }) => {
                return <Ionicons name="ios-search" size={26} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="Messagess"
            component={Messages}
            options={({ route, navigation }) => ({
              title: "Mesajlar",
              headerLeft: () => {
                return (
                  <Ionicons
                    name="ios-open-outline"
                    size={25}
                    color="black"
                    style={{ marginLeft: 15 }}
                    onPress={() => navigation.push("Contact")}
                  />
                );
              },
              headerRight: () => {
                console.log(navigation);
                return (
                  <TouchableOpacity onPress={() => navigation.push("Settings")}>
                    <Ionicons
                      name="ios-settings-outline"
                      size={25}
                      color="black"
                      style={{ marginRight: 15 }}
                    />
                  </TouchableOpacity>
                );
              },
              headerBackVisible: false,
              tabBarIcon: ({ color, size }) => {
                return (
                  <Ionicons name="ios-chatbubbles" size={26} color={color} />
                );
              },
            })}
          />
        </Tab.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerBackTitle: "Geri",
          }}
        >
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  title: "Telefon Numarası",
                }}
              />
              <Stack.Screen
                name="Code"
                component={Code}
                options={{
                  headerBackTitle: "Geri",
                  title: "Doğrulama Kodu",
                  animationTypeForReplace: state.isSignout ? "pop" : "push",
                }}
              />
            </>
          ) : (
            // User is signed in
            <>
              <Stack.Screen
                name="Messages"
                component={Tabs}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Message"
                component={Message}
                options={({ route, navigation }) => ({
                  headerTitle: () => {
                    return (
                      <View style={styles.imageView}>
                        <Image
                          style={styles.image}
                          source={
                            route.params.image === "default"
                              ? require("./assets/defaultimage.png")
                              : { uri: config.server + route.params.image }
                          }
                        />
                      </View>
                    );
                  },
                  title: route.params.name,
                  headerLeft: () => {
                    return (
                      <TouchableOpacity
                        style={styles.messageBack}
                        onPress={() => navigation.goBack()}
                      >
                        <Feather name="chevron-left" size={30} color="black" />
                        <Text style={styles.nameText}>{route.params.name}</Text>
                      </TouchableOpacity>
                    );
                  },
                  headerRight: () => {
                    return (
                      <Feather
                        name="more-horizontal"
                        size={25}
                        color="black"
                        onPress={() => alert("ddd")}
                      />
                    );
                  },
                  animationTypeForReplace: state.isSignout ? "pop" : "push",
                })}
              />
              <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="Contact"
                component={Contact}
                options={{
                  headerShown: true,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
const styles = StyleSheet.create({
  messageBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  imageView: {
    width: 35,
    height: 35,
    borderRadius: 20,
    overflow: "hidden",
    marginLeft: 5,
  },
  image: {
    width: 35,
    height: 35,
  },
  nameText: {
    fontSize: 17,
    fontWeight: "600",
  },
});
