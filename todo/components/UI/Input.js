import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";

// Composant représentant la barre d'input pour ajouter une taskList ou une tâche.
export default function Input({ add }) {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setText}
        onSubmitEditing={() => {
          add(text);
          setText("");
        }}
        placeholder="Enter new Item"
        value={text}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => {
          add(text);
          setText("");
        }}
        style={styles.button}
      >
        <Ionicons name="add" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 5, // Pour une ombre sur Android
    shadowColor: "#000", // Pour une ombre sur iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    marginRight: 10,
  },
  button: {
    backgroundColor: "#223152",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
  },
});