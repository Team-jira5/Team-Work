import { sendEmail } from "../controllers/email.controller.js";
import express from "express";

const router = express.Router();
router.post("/send", sendEmail); // Doit correspondre à l'URL dans Postman

export default router;