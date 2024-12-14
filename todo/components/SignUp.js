import React, { useState } from "react"; // Importation de React et du hook useState pour gérer les états.
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"; // Importation des composants React Native de base.
import { TouchableOpacity } from "react-native-gesture-handler"; // Bouton tactile.
import { signUp } from "../API/Api"; // Fonction pour effectuer une requête d'inscription à l'API.

import { TokenContext, UsernameContext } from "../Context/Context"; // Contextes globaux pour stocker le jeton et le nom d'utilisateur.

export default function SignUp() {
  // Déclaration des états locaux pour gérer les données utilisateur et l'état de l'interface.
  const [login, setLogin] = useState(""); // Stocke le login saisi par l'utilisateur.
  const [password, setPassword] = useState(""); // Stocke le mot de passe saisi par l'utilisateur.
  const [copyPassword, setCopyPassword] = useState(""); // Stocke la confirmation du mot de passe.
  const [error, setError] = useState(""); // Message d'erreur affiché à l'utilisateur en cas de problème.
  const [visible, setVisible] = useState(true); // Détermine si l'écran de saisie ou le spinner est affiché.

  // Fonction appelée pour créer un compte.
  const create = (setToken, setUsername) => {
    setError(""); // Réinitialise le message d'erreur.
    if (login == "" || password == "" || copyPassword == "") return; // Vérifie que tous les champs sont remplis.
    if (password != copyPassword) {
      // Vérifie que les mots de passe correspondent.
      setError("Mot de Passe différents"); // Affiche une erreur si les mots de passe ne correspondent pas.
      return;
    }
    setVisible(false); // Affiche le spinner pendant le traitement.
    signUp(login, password) // Appelle la fonction API pour effectuer l'inscription.
      .then((token) => {
        setUsername(login); // Enregistre le login dans le contexte global.
        setToken(token); // Enregistre le jeton d'authentification dans le contexte global.
        console.log("token", token); // Affiche le token dans la console (pour débogage).
      })
      .catch((err) => {
        setError(err.message); // Affiche un message d'erreur si l'inscription échoue.
      });
    setVisible(true); // Réaffiche les champs de saisie une fois terminé.
  };

  return (
    <TokenContext.Consumer>
      {/* Utilise le contexte pour accéder et modifier le token */}
      {([token, setToken]) => (
        <UsernameContext.Consumer>
          {/* Utilise le contexte pour accéder et modifier le nom d'utilisateur */}
          {([username, setUsername]) => {
            return (
              <View>
                {visible ? ( // Si `visible` est vrai, afficher les champs de saisie.
                  <>
                    {/* Champ pour le login */}
                    <View>
                      <Text style={styles.label}>Login</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="login"
                        onChangeText={setLogin} // Met à jour l'état `login` à chaque modification.
                        onSubmitEditing={() =>
                          create(setToken, setUsername) // Soumet les informations à l'API si l'utilisateur appuie sur "Entrée".
                        }
                        value={login} // Valeur actuelle du champ.
                      />
                    </View>
                    {/* Champ pour le mot de passe */}
                    <View>
                      <Text style={styles.label}>Password</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={setPassword} // Met à jour l'état `password`.
                        secureTextEntry={true} // Cache le texte saisi (mode mot de passe).
                        onSubmitEditing={() =>
                          create(setToken, setUsername)
                        }
                        value={password} // Valeur actuelle du champ.
                      />
                    </View>
                    {/* Champ pour confirmer le mot de passe */}
                    <View>
                      <Text style={styles.label}>Confirm Password</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        onChangeText={setCopyPassword} // Met à jour l'état `copyPassword`.
                        secureTextEntry={true} // Cache le texte saisi (mode mot de passe).
                        onSubmitEditing={() =>
                          create(setToken, setUsername)
                        }
                        value={copyPassword} // Valeur actuelle du champ.
                      />
                    </View>
                    {/* Bouton pour soumettre les informations */}
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => create(setToken, setUsername)}
                    >
                      <Text style={styles.submitButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                    {/* Affichage des messages d'erreur */}
                    {error ? (
                      <Text style={styles.text_error}>{error}</Text>
                    ) : (
                      []
                    )}
                  </>
                ) : (
                  // Si `visible` est faux, affiche un indicateur de chargement.
                  <ActivityIndicator />
                )}
              </View>
            );
          }}
        </UsernameContext.Consumer>
      )}
    </TokenContext.Consumer>
  );
}

// Styles pour les différents éléments du composant.
const styles = StyleSheet.create({
  label: {
    textAlign: "center",
    color: "white",
    fontWeight: 600,
    marginBottom: 15,
  },
  text_error: {
    color: "red", // Texte rouge pour les messages d'erreur.
  },
  text_input: {
    backgroundColor: "white",
    margin: 5,
  },
  input: {
    padding: 15, // Ajoute du padding pour le texte à l'intérieur.
    width: 300, // Largeur du champ.
    marginBottom: 15, // Espacement inférieur.
    borderColor: "black", // Bordure noire.
    borderWidth: 1, // Épaisseur de la bordure.
    borderRadius: 10, // Coins arrondis.
    backgroundColor: "white", // Fond blanc.
  },
  submitButton: {
    borderRadius: 10, // Coins arrondis pour le bouton.
    backgroundColor: "#0080F6", // Fond bleu.
    padding: 15, // Padding interne.
  },
  submitButtonText: {
    color: "white", // Texte blanc.
    textAlign: "center", // Centre le texte.
    fontSize: 30, // Taille du texte.
    fontWeight: 500, // Poids du texte (semi-gras).
  },
});
