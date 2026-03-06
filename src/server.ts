import app from "./app.js";
import sql from "./config/db.js";
import { deleteAllDocuments } from "./services/deleteData.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});

// Gestion de l'arrêt gracieux
const gracefulShutdown = async (signal: string) => {
  console.log(`\nSignal ${signal} reçu. Nettoyage final...`);
  try {
    // Supprimer les données avant de fermer
    await deleteAllDocuments();
    // Fermer la connexion à la DB
    await sql.end();
    console.log("✅ Connexions fermées et données supprimées. Arrêt.");
    server.close(() => {
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage final :", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
