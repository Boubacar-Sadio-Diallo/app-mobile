import React, { useContext, useState, useEffect } from "react";
// Importation des fonctionnalités nécessaires de React.

import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Button,
} from 'react-native';
// Importation des composants de base de React Native.

import { TokenContext } from '../Context/Context';
// Contexte global pour accéder au jeton d'authentification.

import TodoItem from './TodoItem';
// Composant pour afficher un élément individuel (une tâche).

import Input from './UI/Input';
// Composant pour ajouter une nouvelle tâche.

import { editTodo, addTodo, updateTodo, deleteTodo, getTodos, checkDone } from '../API/Api';
// Fonctions d'API pour gérer les tâches (CRUD).

import { Pie } from 'react-native-progress';
// Composant pour afficher une barre de progression circulaire.

export default function Todo({ route }) {
    const ListID = route.params.id;
    // Récupère l'ID de la liste passée en paramètre à ce composant.

    // États locaux :
    const [token, setToken] = useContext(TokenContext); // Accès au jeton via le contexte global.
    const [todos, setTodos] = useState([]); // Liste des tâches.
    const [datas, setDatas] = useState([]); // Données brutes, pour filtrage et restauration.
    const [count, setCount] = useState(0); // Nombre total de tâches.
    const [error, setError] = useState(""); // Message d'erreur.
    const [countDoneTodo, setCountDoneTodo] = useState(0); // Tâches réalisées.
    const [countNoneTodo, setcountNoneTodo] = useState(0); // Tâches non réalisées.
    const [editContent, setEditContent] = useState(""); // Contenu en cours d'édition.
    const [editId, setEditId] = useState(null); // ID de la tâche en cours d'édition.
    const [nbItemDone, setNbItemDone] = useState(0); // Nombre de tâches terminées.
    const [previous, setPrevious] = useState(null); // Sauvegarde d'un état précédent.
    const [newText, setNewText] = useState(todos.content); // Texte modifié pour une tâche.

    // Fonction pour récupérer les tâches via l'API.
    const _getTodos = async () => {
        setError(""); // Réinitialise les erreurs.
        try {
            const data = await getTodos(ListID, token); // Appelle l'API pour récupérer les tâches.
            setTodos(data); // Met à jour la liste des tâches.
            setDatas(data); // Stocke les données brutes.
            setNbItemDone(data.filter((item) => item.done).length); // Compte les tâches réalisées.
            return data;
        } catch (err) {
            setError(err.message); // Affiche une erreur si la récupération échoue.
        }
    };

    // Fonction pour supprimer une tâche.
    const deleteTODO = async (id) => {
        try {
           await deleteTodo(id, token); // Appelle l'API pour supprimer une tâche.
           const newTodos = todos.filter(item => item.id !== id); // Supprime localement la tâche supprimée.
           setTodos(newTodos); // Met à jour la liste des tâches.
           setDatas(newTodos); // Met à jour les données brutes.
           setCount(newTodos.length); // Met à jour le compteur total.
       } catch (err) {
           setError(err.message); // Affiche une erreur en cas d'échec.
       }
    };

    // Utilise `useEffect` pour charger les tâches lors du montage du composant.
    useEffect(() => {
        _getTodos().then((data) => setTodos(data)); // Charge les tâches et met à jour l'état.
    }, []);

    // Met à jour les compteurs chaque fois que la liste des tâches (`todos`) change.
    useEffect(() => {
        const doneCount = todos.filter(item => item.done).length; // Tâches terminées.
        const noneCount = todos.length - doneCount; // Tâches non terminées.
        setCountDoneTodo(doneCount); // Met à jour le compteur des tâches terminées.
        setcountNoneTodo(noneCount); // Met à jour le compteur des tâches non terminées.
        setCount(todos.length); // Met à jour le compteur total.
    }, [todos]);

    // Fonction pour ajouter une nouvelle tâche.
    const addNewTodo = (content) => {
        setError(""); // Réinitialise les erreurs.
        if (!content) { // Vérifie si le contenu est vide.
            setError("Invalid Input"); // Affiche une erreur si c'est le cas.
            return;
        }
        addTodo(content, ListID, token) // Appelle l'API pour ajouter une tâche.
            .then((todo) => {
                setTodos([...todos, todo]); // Ajoute la tâche à la liste locale.
                setDatas([...todos, todo]); // Met à jour les données brutes.
            })
            .catch((err) => setError(err.message)); // Affiche une erreur si l'API échoue.
    };

    // Fonction pour mettre à jour une tâche (marquée comme terminée ou non).
    const upDateTodo = (id, done) => {
        return updateTodo(id, done, token) // Appelle l'API pour mettre à jour une tâche.
          .then(() => {
            const copyOftodos = todos.map((item) => { // Modifie localement la tâche mise à jour.
              if (item.id === id) item.done = !item.done;
              return item;
            });
            setTodos(copyOftodos); // Met à jour la liste des tâches.
            setDatas(copyOftodos); // Met à jour les données brutes.
          })
          .catch((err) => setError(err.message)); // Affiche une erreur si l'API échoue.
    };

    // Fonction pour cocher toutes les tâches.
    const checkAlls = () => {
        todos.forEach((item) => {
          if (!item.done) upDateTodo(item.id, true); // Marque chaque tâche comme terminée.
        });
    };

    // Fonction pour décocher toutes les tâches.
    const uncheckAll = () => {
        todos.forEach((item) => {
          if (item.done) upDateTodo(item.id, false); // Marque chaque tâche comme non terminée.
        });
    };

    // Fonction pour afficher uniquement les tâches terminées.
    const _checkDone = () => {
        const newTodos = datas.filter(item => item.done == true); // Filtre les tâches terminées.
        setTodos(newTodos); // Met à jour la liste affichée.
    };

    // Fonction pour afficher uniquement les tâches non terminées.
    const checkNone = () => {
        const newTodos = datas.filter(item => item.done == false); // Filtre les tâches non terminées.
        setTodos(newTodos); // Met à jour la liste affichée.
    };

    // Fonction pour réafficher toutes les tâches.
    const showAll = () => {
        setTodos(datas); // Réinitialise la liste affichée avec toutes les tâches.
    };

    // Calcul du pourcentage de progression.
    const progress = count > 0 ? countDoneTodo / count : 0;

    // Retourne l'interface utilisateur.
    return (
        <View style={styles.container}>
            <Input add={addNewTodo} /> {/* Champ pour ajouter une nouvelle tâche. */}
            <FlatList
                data={todos} // Liste des tâches à afficher.
                renderItem={({ item }) => (
                    <TodoItem
                        item={item}
                        upDateTodo={upDateTodo} // Met à jour une tâche.
                        deleteTODO={deleteTODO} // Supprime une tâche.
                    />
                )}
            />
            <Text>{countDoneTodo} tâches réalisées sur {count} au total</Text>
            <View style={styles.progressContainer}>
                <Pie
                    progress={progress} // Affiche la progression des tâches réalisées.
                    color="#4caf50" // Couleur verte pour la progression.
                />
                <Text style={styles.progressText}>{(progress * 100).toFixed(0)}%</Text>
            </View>
            <View style={styles.buttonContainer}>
                {/* Boutons pour différentes actions */}
                <Button onPress={checkAlls} title="Check ALL" color="#223152" />
                <Button onPress={uncheckAll} title="Uncheck ALL" color="#223152" />
                <Button onPress={_checkDone} title="Check Done" color="#223152" />
                <Button onPress={checkNone} title="Check None" color="#223152" />
                <Button onPress={showAll} title="Show All" color="#223152" />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null} {/* Affiche les erreurs */}
        </View>
    );
}

// Styles pour personnaliser l'apparence.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
    },
    progressContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    errorText: {
        color: '#e74c3c',
        marginTop: 10,
    },
});
