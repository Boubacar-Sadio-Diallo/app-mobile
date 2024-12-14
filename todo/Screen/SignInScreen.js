import React from "react";
import { Text, View } from "react-native";
import SignIn from '../components/SignIn'
export default function SignInScreen() {
  return (
    <View>
      <SignIn />  {/*Utilisez le composant importé */}
    </View>
  );
}
