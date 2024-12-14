import React, { useState } from "react"; 
// Import de React et du hook `useState` pour gérer les états locaux.

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"; 
// Importation des composants React Native pour afficher du texte, des champs de saisie, etc.

import { TouchableOpacity } from "react-native-gesture-handler"; 
// Composant pour créer des boutons tactiles.

import { MaterialIcons } from '@expo/vector-icons'; 
// Import des icônes Material Design.

import { signIn } from "../API/Api"; 
// Fonction pour effectuer une requête de connexion à une API.

import { TokenContext, UsernameContext } from "../Context/Context"; 
// Contextes globaux pour partager le jeton et le nom d'utilisateur dans l'application.

import { Link } from '@react-navigation/native'; 
// Composant pour naviguer entre les écrans via des liens.

export default function SignIn() {
  const [login, setLogin] = useState(""); 
  // État pour stocker le login saisi par l'utilisateur.

  const [password, setPassword] = useState(""); 
  // État pour stocker le mot de passe saisi.

  const [error, setError] = useState(""); 
  // État pour gérer les messages d'erreur.

  const [visible, setVisible] = useState(true); 
  // État pour contrôler l'affichage des champs de saisie ou du spinner.

  // Fonction de connexion appelée lors de la soumission des données.
  const logger = (setToken, setUsername) => {
    setError(""); 
    // Réinitialise les erreurs.

    if (login === "" || password === "") return; 
    // Vérifie que les champs `login` et `password` ne sont pas vides.

    setVisible(false); 
    // Affiche un indicateur de chargement pendant le traitement.

    signIn(login, password) 
      .then((token) => {
        setUsername(login); 
        // Met à jour le nom d'utilisateur dans le contexte global.

        setToken(token); 
        // Met à jour le jeton d'authentification dans le contexte global.
      })
      .catch((err) => {
        setError(err.message); 
        // Affiche un message d'erreur si la requête échoue.
      });

    setVisible(true); 
    // Réaffiche les champs de saisie après le traitement.
  };

  return (
    <TokenContext.Consumer>
      {/* Consomme le contexte pour accéder au jeton et à sa méthode `setToken`. */}
      {([token, setToken]) => (
        <UsernameContext.Consumer>
          {/* Consomme le contexte pour accéder au nom d'utilisateur et à sa méthode `setUsername`. */}
          {([username, setUsername]) => (
            <View style={styles.container}>
              {visible ? (
                // Si `visible` est vrai, afficher les champs de saisie.
                <>
                  {/* Champ pour le login */}
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="person" size={24} color="#223152" /> 
                    {/* Icône utilisateur */}
                    <TextInput
                      style={styles.input}
                      placeholder="Login"
                      onChangeText={setLogin} 
                      // Met à jour l'état `login` à chaque modification.
                      value={login} 
                      // Définit la valeur actuelle du champ.
                      onSubmitEditing={() => logger(setToken, setUsername)} 
                      // Soumet les informations lorsqu'on appuie sur "Entrée".
                    />
                  </View>

                  {/* Champ pour le mot de passe */}
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={24} color="#223152" /> 
                    {/* Icône cadenas */}
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      onChangeText={setPassword} 
                      // Met à jour l'état `password`.
                      secureTextEntry={true} 
                      // Cache le texte saisi.
                      value={password} 
                      // Définit la valeur actuelle du champ.
                      onSubmitEditing={() => logger(setToken, setUsername)} 
                      // Soumet les informations lorsqu'on appuie sur "Entrée".
                    />
                  </View>

                  {/* Bouton de connexion */}
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => logger(setToken, setUsername)} 
                    // Déclenche la fonction `logger` pour soumettre les données.
                  >
                    <Text style={styles.submitButtonText}>Sign In</Text>
                    {/* Texte du bouton */}
                  </TouchableOpacity>

                  {/* Gestion des erreurs */}
                  {error ? (
                    <>
                      <Text style={styles.text_error}>
                        {error} 
                        {/* Affiche le message d'erreur */}
                      </Text>
                      <Text style={{ color: "black", marginTop: 15 }}>
                        If you prefer, you can{" "}
                        <Link
                          style={{ textDecorationLine: "underline" }}
                          to={{ screen: "SignUp" }} 
                          // Lien vers l'écran d'inscription.
                        >
                          Sign Up
                        </Link>
                      </Text>
                    </>
                  ) : null}
                </>
              ) : (
                <ActivityIndicator /> 
                // Spinner affiché pendant le traitement.
              )}
            </View>
          )}
        </UsernameContext.Consumer>
      )}
    </TokenContext.Consumer>
  );
}

// Styles pour personnaliser l'apparence des composants.
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    // Le composant occupe tout l'écran.
    justifyContent: 'center', 
    // Centre verticalement.
    alignItems: 'center', 
    // Centre horizontalement.
    backgroundColor: '#f2f2f2', 
    // Fond gris clair.
  },
  inputContainer: {
    flexDirection: 'row', 
    // Icônes et champs alignés horizontalement.
    alignItems: 'center', 
    // Centre verticalement.
    width: '80%', 
    // Largeur relative à l'écran.
    marginBottom: 15, 
    // Espacement inférieur.
    padding: 10, 
    // Espacement interne.
    borderColor: '#ccc', 
    // Bordure grise.
    borderWidth: 1, 
    // Épaisseur de la bordure.
    borderRadius: 10, 
    // Coins arrondis.
    backgroundColor: 'white', 
    // Fond blanc.
  },
  input: {
    flex: 1, 
    // Le champ occupe tout l'espace restant dans la ligne.
    padding: 10, 
    // Espacement interne.
    marginLeft: 10, 
    // Espacement entre l'icône et le champ.
    borderRadius: 10, 
    // Coins arrondis.
  },
  submitButton: {
    borderRadius: 10, 
    // Coins arrondis.
    backgroundColor: "#0080F6", 
    // Fond bleu.
    padding: 15, 
    // Espacement interne.
    width: '80%', 
    // Largeur relative à l'écran.
    alignItems: 'center', 
    // Centre le texte dans le bouton.
  },
  submitButtonText: {
    color: "white", 
    // Texte blanc.
    fontSize: 18, 
    // Taille du texte.
    fontWeight: 'bold', 
    // Texte en gras.
  },
  text_error: {
    color: "red", 
    // Texte rouge pour les erreurs.
    marginTop: 10, 
    // Espacement supérieur.
  },
});
