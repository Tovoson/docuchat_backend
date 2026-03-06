```markdown
# DocuChat

DocuChat est un système de **RAG (Retrieval-Augmented Generation)** permettant d'interagir intelligemment avec vos documents. Importez vos fichiers, indexez-les dans une base de données vectorielle et discutez avec leur contenu en temps réel.

## 🚀 Fonctionnalités

- **Importation de documents** : Chargement et segmentation (chunking) de documents.
- **Stockage Vectoriel** : Utilisation de **PostgreSQL** (avec l'extension `pgvector`) pour stocker les embeddings.
- **Génération IA** : Intégration de l'**API Google Gemini** pour des réponses précises et contextuelles.
- **Recherche Sémantique** : Récupération des segments les plus pertinents pour répondre aux requêtes utilisateur.

## 🛠️ Stack Technique

- **Langage** : Javascript
- **Base de données** : PostgreSQL + `pgvector`
- **LLM & Embeddings** : Google Gemini API
- **Orchestration** : LangChain / LlamaIndex (selon implémentation)

## 📋 Prérequis

- Une instance PostgreSQL avec l'extension `pgvector`.
- Une clé API Google AI (Gemini).
- Node.js v22.20.0

## ⚙️ Installation

1. **Cloner le projet** :
   ```bash
   git clone <url-du-repo>
   cd docuchat/backend
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configuration de l'environnement** :
   Créez un fichier `.env` à la racine du dossier `backend` :
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/docuchat
   GEMINI_API_KEY=votre_cle_api_gemini
   ```

## 📖 Utilisation

1. **Initialisation** : Assurez-vous que l'extension `pgvector` est activée sur votre base de données (`CREATE EXTENSION vector;`).
2. **Ingestion** : Importez un document via l'API. Le système va extraire le texte, générer des embeddings via Gemini et les stocker dans PostgreSQL.
3. **Chat** : Envoyez une question. Le système recherchera le contexte pertinent dans la base de données et générera une réponse via l'API Gemini.
```
### Deploiment
Cet app est déjà déploié sur Railway.app
Lien : https://docuchat-production.up.railway.app/