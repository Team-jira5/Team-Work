import express from "express";
import { createContact, getContacts, removeContact } from "../controllers/contact.controller.js";
import authenticate from "../middleware/auth.js";  // Importer le middleware d'authentification

const router = express.Router();

// Route pour récupérer tous les contacts (pas besoin d'authentification)
router.get("/", getContacts);

// Route pour créer un contact (pas besoin d'authentification)
router.post("/", createContact);

// Route pour supprimer un contact (avec authentification)
router.delete("/:id", authenticate, removeContact);  // Appliquer le middleware d'authentification ici

export default router;
