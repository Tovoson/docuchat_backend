import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import sql from "../config/db.js"; // Import de la connexion

/**
 * Traite un buffer PDF : extrait le texte, le découpe en morceaux et stocke les embeddings dans Supabase.
 * @param buffer Le buffer du fichier PDF
 */
export const processPdf = async (buffer: Buffer) => {
  console.log("📄 Début du traitement du PDF (Service)...");

  // 1. Extraction du texte du PDF
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();
  const fullText = data.text;
  console.log(`✅ Texte extrait (${fullText.length} caractères)`);

  // 2. Découpage du texte en morceaux (chunks)
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitText(fullText);
  console.log(`✂️  Découpé en ${chunks.length} morceaux`);

  // Configuration des embeddings Gemini
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY || "",
    modelName: "gemini-embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });

  // 3. Traitement de chaque morceau
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (!chunk) continue;

    console.log(`  - Traitement du morceau ${i + 1}/${chunks.length}...`);

    try {
      // 4. Génération de l'embedding via Google Gemini
      const vector = await embeddings.embedQuery(chunk);

      console.log(
        `    📏 Taille du vecteur pour le morceau ${i + 1} : ${vector.length}`,
      );

      if (!vector || vector.length === 0) {
        throw new Error(
          `Échec de l'obtention de l'embedding pour le morceau ${i}`,
        );
      }

      // 5. Sauvegarde dans Supabase avec l'embedding vectoriel
      await sql`
        INSERT INTO documents (content, embedding) 
        VALUES (${chunk}, ${JSON.stringify(vector)})
      `;
    } catch (err) {
      console.error(`❌ Erreur lors du traitement du morceau ${i + 1}:`, err);
      throw err;
    }
  }

  console.log("🏁 Traitement du PDF terminé !");
  return { chunksCount: chunks.length };
};
