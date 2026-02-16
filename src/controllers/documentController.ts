import type { Request, Response } from "express";
import { processPdf } from "../services/documentProcessor.js";
import sql from "../config/db.js"; // Import de la connexion Supabase

/**
 * Contrôleur pour la gestion des documents
 */
export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Aucun fichier PDF fourni" });
    }

    console.log(`📥 [Controller] Fichier reçu : ${file.originalname}`);

    // Délègue le traitement lourd au service
    const result = await processPdf(file.buffer);

    res.json({
      message: "PDF traité et stocké avec succès",
      chunks: result.chunksCount,
    });
  } catch (error: any) {
    console.error(
      "❌ [Controller] Erreur lors de l'upload/traitement :",
      error,
    );
    res
      .status(500)
      .json({ error: error.message || "Erreur interne du serveur" });
  }
};

// Fonction pour obtenir le nombre de documents stockés dans Supabase
export const getDocumentsCount = async (_: Request, res: Response) => {
  try {
    const result = await sql`SELECT COUNT(*) FROM documents`;
    const count = result[0] ? parseInt(result[0].count, 10) : 0;
    res.json({ count });
  } catch (error) {
    console.error("❌ Erreur lors du comptage des documents :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
