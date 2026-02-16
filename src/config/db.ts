// Import du client PostgreSQL pour Supabase
import postgres from "postgres";

// Récupération de l'URL de connexion Supabase depuis les variables d'environnement
const connectionString = process.env.DATABASE_URL;

// Création de la connexion SQL avec Supabase
// Le client postgres gère automatiquement le pooling et les reconnexions
const sql = postgres(connectionString!, {
  // Options de configuration pour Supabase
  max: 10, // Nombre maximum de connexions dans le pool
  idle_timeout: 20, // Timeout en secondes pour les connexions inactives
  connect_timeout: 10, // Timeout en secondes pour la connexion initiale
  connection: {
    // Forcer l'utilisation d'IPv4 pour éviter les problèmes de connexion IPv6
    family: 4,
  },
});

// Log de confirmation de connexion
console.log("✅ Client Supabase initialisé");

// Export de la connexion SQL pour utilisation dans l'application
export default sql;
