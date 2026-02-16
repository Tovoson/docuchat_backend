import dotenv from "dotenv";

// Charger les variables d'environnement immédiatement
dotenv.config();

// Gestionnaires d'erreurs globaux pour capturer [Object: null prototype] et autres plantages ESM
process.on("uncaughtException", (err) => {
  console.error("🔥 EXCEPTION NON CAPTURÉE :");
  console.error(err);
  // S'il s'agit de l'étrange erreur [Object: null prototype], on essaie de l'inspecter plus en profondeur
  if (err && typeof err === "object" && Object.getPrototypeOf(err) === null) {
    console.dir(err, { depth: null });
  }
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 REJET NON GÉRÉ à :", promise, "raison :", reason);
});

console.log(
  "⚙️  Système amorcé (Env chargée, Gestionnaires d'erreurs configurés)",
);
