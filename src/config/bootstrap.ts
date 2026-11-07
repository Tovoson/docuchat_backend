import dotenv from "dotenv";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.error("EXCEPTION NON CAPTURÉE :");
  console.error(err);
  if (err && typeof err === "object" && Object.getPrototypeOf(err) === null) {
    console.dir(err, { depth: null });
  }
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("REJET NON GÉRÉ à :", promise, "raison :", reason);
});
