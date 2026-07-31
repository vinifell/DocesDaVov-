import express from "express";
import cors from "cors";
import routerCategorias from "./routes/categorias.js";
import routerProdutos from "./routes/produtos.js";
import routerUrls from "./routes/urlsProdutos.js";
import routerDesc from "./routes/descricao.js";
import routerPedidos from "./routes/pedidos.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/categorias", routerCategorias);
app.use("/produtos", routerProdutos);
app.use("/urlsProdutos", routerUrls);
app.use("/descricao", routerDesc);
app.use("/pedidos", routerPedidos);

export default app;