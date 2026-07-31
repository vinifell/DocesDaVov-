import { select, selectUnico, insert, update, deletar } from "../repository/query.js";

export async function get(req, res){
    const resposta = await select("produtos");
    if(resposta.sucesso){
        res.status(200).json(resposta);
    }else{
        res.status(500).json(resposta);
    }
}

export async function getUnico(req, res){
    const id = req.params.id;
    const resposta = await selectUnico("idProduto = ?", [id], "produtos");
    res.status(resposta.status).json(resposta);
}

export async function post(req, res){
    const { nomeProduto, preco, disponivel, idCategoria } = req.body;
    if(!nomeProduto || !preco || !disponivel || !idCategoria){
        res.status(400).json({
            sucesso: false,
            Erro: "Dados inválidos, tente novamente!"
        })
        return
    }
    
    const existe = await selectUnico("idCategoria = ?", [idCategoria], "categorias")
    if(existe.sucesso){
        if(existe.resposta.length){
            const resposta = await insert("produtos(nomeProduto, preco, disponivel, idCategoria)", "?, ?, ?, ?", [nomeProduto, preco, disponivel, idCategoria]);
            res.status(resposta.status).json(resposta);
        }else{
            res.status(400).json({
                sucesso: false,
                Erro: "Categoria não existe, tente novamente!"
            })
        }
    }else{
        res.status(500).json(existe);
    }
}

export async function put(req, res){
    const campos = [ "nomeProduto", "preco", "disponivel", "idCategoria"]
    const body = req.body;
    const id = req.params.id;
    
    for(let i=3; i>-1; i--) {
        let campo = campos[i];
        if(campo === "disponivel" && req.body.disponivel === undefined || campo == "nomeProduto" || campo === "preco" || campo === "idCategoria"){
            if(!req.body[campo]){
                campos.splice(i, 1);
            }else{
                campos[i] = campo + " = ?"
            }
        }else{
            campos[i] = campo + " = ?"
        }
    };
    const existe = await selectUnico("idProduto = ?", [id], "produtos");
    const existeCategoria = await selectUnico("idCategoria = ?", [req.body.idCategoria], "categorias");
    if(existe.sucesso && existeCategoria.sucesso){
        if(existe.resposta.length && existeCategoria.resposta.length){
            if(campos.length){
                const resposta = await update("produtos", campos, "idProduto = ?", [...Object.values(req.body), id]);
                res.status(resposta.status).json(resposta);
            }else{
                res.status(400).json({
                    sucesso: false,
                    Erro: "Dados inválidos, é necessario enviar pelo menos um dado para a edição ocorrer!"
                })
            }
        }else if(existe.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "ID inválido, produto não existe, tente novamente"
            })
        }else{
            res.status(400).json({
                sucesso: false,
                Erro: "Categoria inválida, categoria não existe, tente novamente"
            })
        }
    }else{
        res.status(500).json({
            ...existe,
            ...existeCategoria
        })
    }
    res.end();
}

export async function excluir(req, res){
    const id = req.params.id;
    const existe = await selectUnico("idProduto = ?", [id], "produtos");
    if(existe.sucesso){
        if(existe.resposta.length){
            const resposta = await deletar("produtos", "idProduto = ?", [id]);
            res.status(resposta.status).json(resposta);
        }else{
            res.status(400).json({
                sucesso: false,
                Erro: "Dados Inválidos, usuario não existe para deletar!"
            })
        }
    }else{
        res.status(500).json(existe);
    }
}