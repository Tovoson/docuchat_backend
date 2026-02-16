// Import de la connexion SQL PostgreSQL
import sql from "./config/db.js";

// Fonction d'initialisation de la base de données PostgreSQL
export const initdb = async () => {
  try {
    // Vérifier la connexion à PostgreSQL en récupérant la version
    const versionResult = await sql`SELECT version()`;
    console.log("✅ Connexion à la base de données réussie");

    // Activer l'extension pgvector pour le stockage des embeddings vectoriels
    console.log("Initialisation du schéma de la base de données...");
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
    console.log("✅ Extension pgvector activée");

    // Créer la table documents si elle n'existe pas
    // La table stocke le contenu des documents et leurs embeddings (3072 dimensions pour Gemini)
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        embedding vector(3072)
      );
    `;
    console.log("✅ Table 'documents' opérationnelle (3072 dimensions)");

    // Vérifier la présence de la clé API Gemini
    if (!process.env.GOOGLE_API_KEY) {
      console.warn("⚠️ GOOGLE_API_KEY est manquante dans le fichier .env");
    } else {
      console.log("✅ Configuration Gemini détectée");
    }
  } catch (err: any) {
    console.error("❌ Erreur de connexion lors du démarrage :");
    console.error(err);
  }
};
