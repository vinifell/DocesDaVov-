import { pegarBanco } from "./admin.js";

export function separarArquivos(dados){
    console.log(dados);
    const { nomeProduto, nomeCategoria, disponivel, descricao, preco, url } = dados;
    console.log(nomeProduto);

    const produto = {
        nomeProduto,
        disponivel: disponivel === "on"? true : false ,
        preco
    }
    
    
}