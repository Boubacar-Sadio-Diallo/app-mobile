import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screen/HomeScreen";
import SignOutScreen from "../Screen/SignOutScreen";
import SignUpScreen from "../Screen/SignUpScreen";
import SignInScreen from "../Screen/SignInScreen";
import NavigationTodo from "../Navigation/NavigationTodo";
import { TokenContext } from '../Context/Context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const [token] = useContext(TokenContext);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'SignIn') {
              iconName = focused ? 'login' : 'login';
            } else if (route.name === 'SignUp') {
              iconName = focused ? 'person-add' : 'person-add';
            } else if (route.name === 'TodoLists') {
              iconName = focused ? 'check-box' : 'check-box-outline-blank';
            } else if (route.name === 'SignOut') {
              iconName = focused ? 'logout' : 'logout';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#e91e63',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        {token == null ? (
          <>
            <Tab.Screen name='SignIn' component={SignInScreen} />
            <Tab.Screen name='SignUp' component={SignUpScreen} />
          </>
        ) : (
          <>
            <Tab.Screen name='Home' component={HomeScreen} />
            <Tab.Screen name='TodoLists' component={NavigationTodo} />
            <Tab.Screen name='SignOut' component={SignOutScreen} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
  },
});
