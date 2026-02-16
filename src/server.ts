import "./config/bootstrap.js";
import express, { type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { initdb } from "./init.js";
import documentRoutes from "./routes/documentRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Initialisation de la base de données
initdb().catch((err) => {
  console.error("❌ initdb a échoué :", err);
});

/**
 * Enregistrement des routes modulaires
 */
app.use("/api", documentRoutes);

app.get("/", async (_: Request, res: Response) => {
  res.json({ message: "Serveur DocuChat Opérationnel !" });
});

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
