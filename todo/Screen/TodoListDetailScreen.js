import React from "react";
import { View } from "react-native";
import TodoList from '../components/Todo'

export default function TodoListDetailScreen({ route }) {
  return (
    <View>
      <TodoList route={route}/>
    </View>
  );
}