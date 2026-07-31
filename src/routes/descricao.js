import express from "express";
import { excluir, get, getUnico, post, put } from "../controllers/descricaoController.js";

const router = express.Router();

router.get("/", get);
router.get("/:idProduto", getUnico);
router.post("/", post);
router.put("/:id", put);
router.delete("/:id", excluir);

export default router;