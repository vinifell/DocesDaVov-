import express from "express";
import cors from "cors";
import routerCategorias from "./routes/categorias.js";
import routerProdutos from "./routes/produtos.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/categorias", routerCategorias);
app.use("/produtos", routerProdutos);

export default app;