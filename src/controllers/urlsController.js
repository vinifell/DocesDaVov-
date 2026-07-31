import { insert, select, selectUnico, update, deletar } from "../repository/query.js";

export async function get(req, res){
    const resposta = await select("urlProduto");
    res.status(resposta.status).json(resposta);
}

export async function getUnico(req, res){
    const idProduto = req.params.idProduto;
    const resposta = await selectUnico("idProduto = ?", [idProduto], "urlProduto");
    res.status(resposta.status).json(resposta);
}

export async function post(req, res){;
    const { url, idProduto } = req.body;
    if(!url, !idProduto){
        res.status(400).json({
            sucesso: false,
            Erro: "Dados obrigatórios inválidos, insira-os para continuar!"
        })
        return
    }
    const existe = await selectUnico("idProduto = ?", [idProduto], "produtos");
    if(existe.sucesso){
        if(existe.resposta.length){
            const resposta = await insert("urlProduto(url, idProduto)", "?, ?", [url, idProduto]);
            res.status(resposta.status).json(resposta);
        }else{
            res.status(400).json({
                sucesso: false,
                Erro: "Produto não existe, insire um produto existente para continuar!"
            });
        }
    }else{ 
        res.status(500).json(existe);
    }
}

export async function put(req, res){
    const campos = [ "url", "idProduto"];
    const id = req.params.id;
    for(let i = 1; i>-1; i--){
        if(!req.body[campos[i]]){
            campos.splice(i, 1);
        }else{
            campos[i] = campos[i] + " = ?";
        }
    }

    if(!campos.length){
        res.status(400).json({
            sucesso: false,
            Erro: "Nenhum dado foi enviado, insire pelo menos um para continuar!"
        })
        return
    }

    let existeProduto = {
        sucesso: true,
        resposta: [1]
    }

    const existe = await selectUnico("idUrlProduto = ?", [id], "urlProduto");
    if(req.body.idProduto){
        existeProduto = await selectUnico("idProduto = ?", [req.body.idProduto], "produtos");
    }

    if(existe.sucesso && existeProduto.sucesso){
        if(existe.resposta.length && existeProduto.resposta.length){
            const resposta = await update("urlProduto", campos, "idUrlProduto = ?", [...Object.values(req.body), id]);
            res.status(resposta.status).json(resposta);
        }else if(existe.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Produto não existe, insire um produto existente para continuar!"
            })
        }else{
            res.status(400).json({
                sucesso: false,
                Erro: "Url não está cadastrada ainda, insire um id de uma url cadastrada para continuar"
            })
        }
    }else{
        res.status(500).json({
            ...existe,
            ...existeProduto
        });
    }
}

export async function excluir(req, res){
    const id = req.params.id;
    const existe = await selectUnico("idUrlProduto = ?", [id], "urlProduto");
    console.log(existe);
    if(existe.sucesso){
        if(existe.resposta.length){
            const resposta = await deletar("urlProduto", "idUrlProduto = ?", [id]);
            res.status(resposta.status).json(resposta);
        }else{
            res.status(400).json({
                sucesso: false,
                Erro: "Id inválido, url não existe!"
            })
        }
    }else{
        res.status(500).json(existe);
    }
}