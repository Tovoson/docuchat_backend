import { type Request, type Response } from "express";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TaskType } from "@google/generative-ai";
import {sql} from "../config/db.js";

// Initialisation lazy ou globale sécurisée du modèle Gemini
const getGenerativeModel = () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is missing in environment variables");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-flash-latest" });
};


export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const model = getGenerativeModel();

    if (!question) {
      return res.status(400).json({ error: "La question est requise" });
    }

    console.log(`[ChatController] Question reçue : "${question}"`);

    // 1. Génération de l'embedding de la question avec Gemini
    console.log("Génération de l'embedding...");
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY || "",
      modelName: "gemini-embedding-001",
      taskType: TaskType.RETRIEVAL_QUERY,
    });

    const questionVector = await embeddings.embedQuery(question);
    console.log(`Vecteur question généré (${questionVector.length} dims)`);

    // 2. Recherche vectorielle dans Supabase (Cosine Similarity)
    console.log("Recherche dans la base de données...");
    // On récupère les 3 morceaux les plus proches en utilisant l'opérateur de distance cosinus
    const searchResult = await sql.query(`
      SELECT content, 1 - (embedding <=> ${JSON.stringify(questionVector)}) as similarity
      FROM documents
      ORDER BY embedding <=> ${JSON.stringify(questionVector)}
      LIMIT 3
    `);

    // Extraction du contexte à partir des résultats de la recherche
    const context = searchResult.map((row: any) => row.content).join("\n\n");
    console.log(`Contexte trouvé (${searchResult.length} morceaux)`);

    // 3. Construire le prompt pour Gemini avec le contexte récupéré
    console.log("Génération de la réponse avec Gemini...");
    const prompt = `Voici des informations contextuelles extraites d'un document PDF :
    
    ${context}
    
    En utilisant UNIQUEMENT ce contexte, réponds à la question suivante :
    Question : ${question}
    
    Si la réponse n'est pas dans le contexte, dis simplement que tu ne sais pas.`;

    // 4. Générer la réponse avec Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const answer = response.text();

    console.log("Réponse générée avec succès");

    // Retourner la réponse avec les sources utilisées
    res.json({
      answer,
      sources: searchResult.map((row: any) => ({
        content: row.content.substring(0, 100) + "...",
        similarity: row.similarity,
      })),
    });
  } catch (error: any) {
    console.error("[Chat] Erreur détaillée :", error);
    if (error.response) {
      console.error("   Détails API :", error.response.data);
    }
    res.status(500).json({
      error: error.message || "Erreur lors de la génération de la réponse",
    });
  }
};
