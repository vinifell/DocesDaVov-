import express from "express";
import { excluir, get, post, put } from "../controllers/mensagensController.js";

const router = express.Router();

router.get("/", get);
router.post("/", post);
router.put("/:id", put);
router.delete("/:id", excluir);

export default router;