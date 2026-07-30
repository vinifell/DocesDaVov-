import express from "express";
import cors from "cors";
import routerCategorias from "./routes/categorias.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/categorias", routerCategorias);

export default app;