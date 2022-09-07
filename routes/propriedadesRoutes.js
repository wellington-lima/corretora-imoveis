import { Router } from "express";
import { admin } from "../controllers/propriedadeController.js";

const router = Router();

router.get("/minhas-propriedades", admin);

export default router;

