import { Router } from "express";
import multer from "multer";
import {
  uploadPdf,
  getDocumentsCount,
} from "../controllers/documentController.js";

const router = Router();

const upload = multer({ dest: "uploads/" });

/**
 * @route POST /api/upload
 * @desc  Reçoit un fichier PDF et le traite
 */
router.post("/upload", upload.single("pdf"), uploadPdf);

/**
 * @route GET /api/documents/count
 * @desc  Vérifie s'il y a des documents dans la base
 */
router.get("/documents/count", getDocumentsCount);

/**
 * @route POST /api/chat
 * @desc  Pose une question sur les documents
 */
import { askQuestion } from "../controllers/chatController.js";
router.post("/chat", askQuestion);

export default router;
