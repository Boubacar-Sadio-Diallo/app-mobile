import React, { useState, useEffect } from 'react';
// Import de React et des hooks `useState` et `useEffect`.

import { TouchableOpacity, View, Text, StyleSheet, Switch, TextInput } from 'react-native';
// Import des composants de base de React Native : boutons, conteneurs, texte, interrupteurs et champs de saisie.

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// Import des icônes Material Design pour ajouter des boutons visuels (édition, suppression, etc.).

export default function TodoItem(props) {
  // Composant représentant une tâche individuelle.

  const [done, setDone] = useState(props.item.done);
  // État local pour savoir si la tâche est terminée (cochée ou non).

  const [isEditing, setIsEditing] = useState(false);
  // État local pour indiquer si la tâche est en mode édition.

  const [editContent, setEditContent] = useState(props.item.content);
  // État local pour stocker le contenu modifié de la tâche.

  useEffect(() => {
    setDone(props.item.done);
    // Met à jour l'état local `done` lorsque la propriété `props.item.done` change.
  }, [props]);

  const toggleSwitch = () => {
    setDone(!done);
    // Inverse localement l'état "fait" ou "non fait".

    props.upDateTodo(props.item.id, !done);
    // Appelle la fonction parent pour notifier que l'état a changé.
  };

  const confirmEdit = () => {
    props.editTodo(props.item.id, editContent);
    // Appelle la fonction parent pour enregistrer les modifications du contenu.

    setIsEditing(false);
    // Désactive le mode édition.
  };

  return (
    <View style={styles.container}>
      {/* Conteneur principal de la tâche */}

      {isEditing ? (
        // Mode édition activé
        <>
          <TextInput
            value={editContent}
            onChangeText={setEditContent}
            style={styles.input}
            // Champ de saisie pour modifier le contenu de la tâche.
          />
          <TouchableOpacity onPress={confirmEdit}>
            <MaterialIcons name="check" size={24} color="#4CAF50" />
            {/* Bouton de validation (icône de check) pour enregistrer les modifications. */}
          </TouchableOpacity>
        </>
      ) : (
        // Mode lecture
        <>
          <Text
            style={[
              styles.textItem,
              { textDecorationLine: done ? 'line-through' : 'none' },
            ]}
          >
            {props.item.content}
            {/* Affiche le contenu de la tâche avec une ligne barrée si elle est terminée. */}
          </Text>
          <Switch
            thumbColor={done ? '#e74c3c' : '#f4f3f4'}
            value={done}
            onValueChange={toggleSwitch}
            // Interrupteur pour basculer entre "fait" et "non fait".
          />
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <MaterialIcons name="edit" size={24} color="#e74c3c" />
            {/* Bouton (icône) pour activer le mode édition. */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.deleteTODO(props.item.id)}>
            <MaterialIcons name="delete" size={24} color="#e74c3c" />
            {/* Bouton (icône) pour supprimer la tâche. */}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// Définition des styles du composant.
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    // Les éléments sont disposés horizontalement.

    alignItems: 'center', 
    // Aligne les éléments verticalement.

    padding: 10, 
    // Espacement interne.

    backgroundColor: '#fff', 
    // Couleur de fond blanche.

    borderRadius: 8, 
    // Coins arrondis.

    marginVertical: 5, 
    // Espacement vertical entre les tâches.

    elevation: 2, 
    // Ombre pour un effet de profondeur.
  },
  textItem: {
    flex: 1, 
    // Le texte occupe tout l'espace horizontal disponible.

    marginLeft: 10, 
    // Espacement entre le texte et le bord gauche.

    fontSize: 16, 
    // Taille de la police.

    color: '#333', 
    // Couleur du texte.
  },
  input: {
    flex: 1, 
    // Le champ de saisie occupe tout l'espace horizontal disponible.

    borderColor: '#ccc', 
    // Bordure grise.

    borderWidth: 1, 
    // Épaisseur de la bordure.

    borderRadius: 4, 
    // Coins légèrement arrondis.

    padding: 5, 
    // Espacement interne.

    marginRight: 10, 
    // Espacement à droite du champ de saisie.
  },
});
