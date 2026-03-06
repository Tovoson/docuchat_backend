import { jest } from "@jest/globals";
import supertest from "supertest";

// ─────────────────────────────────────────
// MOCKS — toujours avant les imports de l'app
// ─────────────────────────────────────────

jest.unstable_mockModule("../src/controllers/documentController.js", () => ({
  uploadPdf: jest.fn((req: any, res: any) =>
    res.status(200).json({ message: "PDF traité", chunks: 5 }),
  ),
  getDocumentsCount: jest.fn((req: any, res: any) =>
    res.status(200).json({ count: 10 }),
  ),
}));

jest.unstable_mockModule("../src/controllers/chatController.js", () => ({
  askQuestion: jest.fn((req: any, res: any) => {
    // Simule une validation basique
    if (!req.body?.question) {
      return res.status(400).json({ error: "Question requise" });
    }
    return res.status(200).json({ answer: "Réponse simulée" });
  }),
}));

jest.unstable_mockModule("../src/init.js", () => ({
  initdb: jest.fn(() => Promise.resolve()),
}));

// ─────────────────────────────────────────
// IMPORTS — après les mocks
// ─────────────────────────────────────────

const { default: app } = await import("../src/app.js");
const { uploadPdf, getDocumentsCount } =
  await import("../src/controllers/documentController.js");
const { askQuestion } = await import("../src/controllers/chatController.js");

// ─────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────

describe("DocuChat API Tests", () => {
  // Health check
  describe("GET /", () => {
    it("returns 200 OK", async () => {
      const res = await supertest(app).get("/");
      expect(res.status).toBe(200);
    });
  });

  // Upload PDF
  describe("POST /api/upload", () => {
    it("accepte un fichier PDF", async () => {
      const res = await supertest(app)
        .post("/api/upload")
        .attach("pdf", Buffer.from("fake pdf content"), "test.pdf");
      // Buffer.from simule un vrai fichier sans en créer un réel

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(uploadPdf).toHaveBeenCalled();
    });
  });

  // Documents count
  describe("GET /api/documents/count", () => {
    it("retourne le nombre de documents", async () => {
      const res = await supertest(app).get("/api/documents/count");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ count: 10 });
      expect(getDocumentsCount).toHaveBeenCalled();
    });

    it("gère une erreur serveur", async () => {
      // mockImplementationOnce remplace le mock UNE SEULE FOIS
      // ensuite il revient au comportement normal
      (getDocumentsCount as jest.Mock).mockImplementationOnce(
        (req: any, res: any) => res.status(500).json({ error: "Mock Error" }),
      );

      const res = await supertest(app).get("/api/documents/count");
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Mock Error");
    });
  });

  // Chat
  describe("POST /api/chat", () => {
    it("répond à une question valide", async () => {
      const res = await supertest(app)
        .post("/api/chat")
        .send({ question: "De quoi parle ce document ?" });
      // send() envoie un body JSON

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("answer");
      expect(askQuestion).toHaveBeenCalled();
    });

    it("retourne 400 si question manquante", async () => {
      const res = await supertest(app).post("/api/chat").send({});
      // Body vide — doit échouer

      expect(res.status).toBe(400);
    });
  });
});
