import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TodoListsScreen from "../Screen/TodoListsScreen";
import TodoListDetailScreen from "../Screen/TodoListDetailScreen";

const Stack = createNativeStackNavigator();

export default function NavigationTodo() {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen name="List" component={TodoListsScreen} />
      <Stack.Screen name="Details" component={TodoListDetailScreen} />
    </Stack.Navigator>
  );
}
