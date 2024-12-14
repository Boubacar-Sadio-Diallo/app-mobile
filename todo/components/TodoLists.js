import Input from "./UI/Input";
// Composant personnalisé pour gérer les ajouts de nouvelles listes.

import { useContext, useState, useEffect } from "react";
// Import des hooks React pour gérer les états (`useState`), les effets (`useEffect`) et les contextes (`useContext`).

import { FlatList, View, Text, Pressable } from "react-native";
// Import des composants de base de React Native : liste, conteneurs, texte et boutons pressables.

import { deleteTodoList, addTodoLists, getTodoLists } from "../API/Api";
// API pour effectuer les opérations CRUD sur les listes de tâches.

import { TokenContext, UsernameContext } from "../Context/Context";
// Contextes globaux pour accéder au jeton d'authentification et au nom d'utilisateur.

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// Icônes Material Design pour ajouter des éléments visuels aux actions.

export default function TodoList({ navigation }) {
  // Composant principal qui gère les listes de tâches.

  const [username] = useContext(UsernameContext);
  const [token] = useContext(TokenContext);
  // Accès au nom d'utilisateur et au jeton via les contextes globaux.

  const [list, setList] = useState([]);
  // État local pour stocker les listes de tâches.

  const [error, setError] = useState("");
  // État local pour afficher les messages d'erreur.

  /**
   * Fonction pour supprimer une liste.
   * @param {string} id - L'identifiant de la liste à supprimer.
   */
  const this_deleteTodoList = async (id) => {
    try {
      await deleteTodoList(id, token);
      // Appelle l'API pour supprimer une liste.

      setList((prevList) => prevList.filter((item) => item.id !== id));
      // Met à jour localement l'état pour supprimer l'élément de la liste.
    } catch (error) {
      console.error("Error deleting todo:", error);
      // Affiche un message d'erreur si l'API échoue.
    }
  };

  /**
   * Fonction pour ajouter une nouvelle liste.
   * @param {string} text - Le titre de la nouvelle liste.
   */
  const addTodoList = async (text) => {
    setError(""); // Réinitialise les erreurs.

    if (!text.trim()) {
      setError("Invalid Input");
      // Si le texte est vide ou ne contient que des espaces, affiche une erreur.
      return;
    }

    try {
      const todo = await addTodoLists(text, username, token);
      // Appelle l'API pour ajouter une nouvelle liste.

      setList((prevList) => [...prevList, todo]);
      // Ajoute la nouvelle liste à l'état local.

      afficheTodoLists();
      // Rafraîchit la liste après ajout.
    } catch (err) {
      setError(err.message || "An error occurred while adding the todo.");
      // Affiche un message d'erreur si l'ajout échoue.
    }
  };

  /**
   * Fonction pour récupérer toutes les listes de tâches.
   */
  const afficheTodoLists = async () => {
    try {
      const todoLists = await getTodoLists(username, token);
      // Appelle l'API pour récupérer toutes les listes de tâches.

      setList(todoLists);
      // Met à jour l'état avec les données récupérées.

      console.log(todoLists);
      // Affiche les données pour débogage.
    } catch (err) {
      console.error("Error fetching todo lists:", err.message);
      // Affiche un message d'erreur si la récupération échoue.
    }
  };

  /**
   * Effet pour charger les listes au montage du composant.
   */
  useEffect(() => {
    afficheTodoLists();
    // Récupère les listes dès que le composant est monté.

  }, [username, token]);
  // Dépendances : recharge les listes si le nom d'utilisateur ou le jeton change.

  return (
    <View>
      {/* Champ d'entrée pour ajouter une nouvelle liste */}
      <View>
        <Input add={addTodoList} />
        {/* Composant personnalisé pour ajouter une nouvelle liste via `addTodoList`. */}

        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
        {/* Affiche les erreurs, si elles existent. */}
      </View>

      {/* Liste déroulante pour afficher les listes existantes */}
      <FlatList
        data={list}
        // Données utilisées pour afficher chaque élément de la liste.

        renderItem={({ item }) => (
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              backgroundColor: "#ffffff",
              borderRadius: 10,
              marginBottom: 10,
              elevation: 3,
            }}
            onPress={() => navigation.navigate("Details", { id: item.id })}
            // Navigation vers un écran de détails avec l'ID de la liste.
          >
            <Text style={{ flex: 1 }}>{item.title}</Text>
            {/* Affiche le titre de la liste. */}

            <MaterialIcons
              name="info"
              size={35}
              color="#223152"
              style={{ marginLeft: 10 }}
            />
            {/* Icône pour afficher des informations supplémentaires. */}

            <Pressable>
              <MaterialIcons name="check-circle" size={35} color="#223152" />
              {/* Icône de validation (non fonctionnelle ici). */}
            </Pressable>

            <Pressable onPress={() => this_deleteTodoList(item.id)}>
              <MaterialIcons
                name="delete"
                size={35}
                color="#e74c3c"
                style={{ marginLeft: 10 }}
              />
              {/* Icône de suppression pour supprimer la liste. */}
            </Pressable>
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        // Utilisation d'une clé unique pour chaque élément de la liste.
      />
    </View>
  );
}
