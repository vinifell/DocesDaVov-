import { deletar, insert, select, selectUnico, update } from "../repository/query.js";

export async function get(req, res) {
    const resposta = await select("descricao");
    res.status(resposta.status).json(resposta);
}

export async function getUnico(req, res){
    const idProduto = req.params.idProduto;
    const resposta = await selectUnico("idProduto = ?", [idProduto], "descricao");
    res.status(resposta.status).json(resposta);
}

export async function post(req, res){
    const { descricao, idProduto } = req.body;

    if(!descricao || !idProduto){
        res.status(400).json({
            sucesso: false,
            Erro: "Dados inválidos, revise e envie-os novamente!"
        });
        return
    }

    const existe = await selectUnico("idProduto = ?", [idProduto], "produtos");
    console.log(existe);
    if(existe.sucesso){
        if(existe.resposta.length){
            const resposta = await insert("descricao(descricao, idProduto)", "?, ?", [descricao, idProduto]);
            res.status(resposta.status).json(resposta);
        }else{
            res.status(400).json({
                sucesso: false,
                Erro: "Produto inserido não existe, insira o id de um produto ja cadastrado para continuar!"
            });
        }
    }else{
        res.status(500).json(existe);
    }
}

export async function put(req, res){
    const campos = ["descricao", "idProduto"];
    const id = req.params.id;

    for(let i = 1; i>-1; i--){
        if(!req.body[campos[i]]){
            campos.splice(i, 1);
        }else{
            campos[i] = campos[i] + " = ?";
        }
    }

    if(req.body.idProduto){
        const existe = await selectUnico("idProduto = ?", [req.body.idProduto], "produtos");
    
        if(!existe.sucesso){
            res.status(500).json(existe);
            return
        }else if(!existe.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Produto inserido não existe, insere o id de um produto cadastrado para continuar!"
            })
            return
        }
    }

    if(campos.length){
        const resposta = await update("descricao", campos, "idDescricao = ?", [...Object.values(req.body), id])
        res.status(resposta.status).json(resposta);
    }else{
        res.status(400).json({
            sucesso: false,
            Erro: "Dados inválidos, é necessario inserir pelo menos um dado para a edição ocorrer!"
        })
    }
}

export async function excluir(req, res){
    const id = req.params.id;

    const existe = await selectUnico("idDescricao = ?", [id], "descricao");
    if(existe.sucesso){
        if(existe.resposta.length){
            const resposta = await deletar("descricao", "idDescricao = ?", [id]);
            res.status(resposta.status).json(resposta);
        }else{
            res.status(400).json({
                sucesso: false,
                Erro: "Id inválido, descricao não está cadastrada!"
            });
        }
    }else{
        res.status(500).json(existe);
    }
}