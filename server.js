import app from "./src/app.js";
import { initTable } from "./src/config/initTables.js";

initTable();

app.listen(3000, () =>{
    console.log("Servidor rodando na porta 3000!")
});