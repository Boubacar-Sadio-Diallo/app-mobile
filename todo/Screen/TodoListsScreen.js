import React from "react";
import { View } from "react-native";
import TodoListAPI from '../components/TodoLists'
export default function TodoListsScreen({ navigation }) {
  return (
    <View>
      <TodoListAPI navigation={navigation}/>
    </View>
  );
}
