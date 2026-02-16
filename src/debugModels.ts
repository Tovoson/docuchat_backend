import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

async function listModels() {
  try {
    // In @google/generative-ai v0.24.1, listModels is indeed a function
    // but maybe it's not exported or typed correctly in this environment?
    // Let's try to see the properties of genAI
    console.log("genAI properties:", Object.keys(genAI));

    // Attempting raw fetch if SDK is problematic
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`,
    );
    const data = await response.json();

    if (data.models) {
      console.log("Available models (via Fetch):");
      data.models.forEach((m: any) => {
        // Affiche tous les modèles pour debug
        console.log(
          `- ${m.name} (Methods: ${m.supportedGenerationMethods.join(", ")})`,
        );
      });
    } else {
      console.log("No models found or error in response:", data);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
