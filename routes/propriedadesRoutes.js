import { Router } from "express";
import { admin, criar } from "../controllers/propriedadeController.js";

const router = Router();

router.get("/minhas-propriedades", admin);
router.get("/propriedades/criar", criar);

export default router;

