import { Router } from "express";
import { mailContact } from "../controllers/contactController.js";

const router = Router();

router.post("/contact", mailContact);

export default router;