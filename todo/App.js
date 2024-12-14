// Importation des bibliothèques React et des hooks nécessaires
import React, { useState } from "react";
// Importation du composant de navigation principal
import Navigation from "./Navigation/Navigation";

// Importation des contextes globaux pour gérer l'état partagé entre les composants
import { TokenContext, UsernameContext } from './Context/Context'

// Composant principal de l'application
export default function App () {
  // Déclaration d'un état local pour gérer le token d'authentification de l'utilisateur
  const [token, setToken] = useState(null);

  // Déclaration d'un état local pour gérer le nom d'utilisateur
  const [username, setUsername] = useState(null);

  // Le return définit l'arborescence des composants React
  return (
    // Fournisseur pour le contexte UsernameContext
    // Permet de partager `username` et `setUsername` avec tous les composants enfants
    <UsernameContext.Provider value={[username, setUsername]}>
      {/* Fournisseur pour le contexte TokenContext */}
      {/* Permet de partager `token` et `setToken` avec tous les composants enfants */}
      <TokenContext.Provider value={[token, setToken]}>
        {/* Le composant Navigation gère la structure et les écrans de l'application */}
        <Navigation />
      </TokenContext.Provider>
    </UsernameContext.Provider>
  );
}
