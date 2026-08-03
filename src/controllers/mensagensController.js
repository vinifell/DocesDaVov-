import { response } from "express";
import { deletar, insert, select, selectUnico, update } from "../repository/query.js";

export async function get(req, res){
    const resposta = await select("mensagens");
    res.status(resposta.status).json(resposta);
}

export async function post(req, res){
    const { mensagem, idPedido } = req.body;

    if(!mensagem || !idPedido || !Number(idPedido)){
        res.status(400).json({
            sucesso: false,
            Erro: "Dados inválidos, tente novamente com dados válidos!"
        })
    }

    const existe = await selectUnico("idPedido = ?", idPedido, "pedidos");
    if(existe.sucesso){
        if(!existe.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Pedido não existe, insire um pedido já cadastrado para continuar!"
            });
            return
        }
    }else{
        res.status(500).json(existe);
        return
    }

    const resposta = await insert("mensagens(mensagem, idPedido)", "?, ?", [mensagem, idPedido]);
    res.status(resposta.status).json(resposta);
}

export async function put(req, res){
    const id = req.params.id;
    let campos = ["mensagem", "idPedido"];
    for(let index=2; index>-1; index--){
        if(req.body[campos[index]]){
            campos[index] = campos[index] + " = ?";
        }else{
            campos.splice(index, 1);
        }
    }

    const mensagemAntiga = await selectUnico("idMensagem = ?", id, "mensagens");

    if(mensagemAntiga.sucesso){
        if(!mensagemAntiga.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Mensagem não cadastrada, envie o id de uma mensagem já cadastrada para continuar!"
            })
            return
        }
    }else{
        res.status(500).json(mensagemAntiga);
    }

    if(!campos.length){
        res.status(400).json({
            sucesso: false,
            Erro: "É necessario pelo menos um dado para a edição"
        })
        return
    }

    let existe = { sucesso: true, resposta: ['Olá']}
    if(req.body.idPedido){
        existe = await selectUnico("idPedido = ?", req.body.idPedido, "pedidos");
    }

    if(existe.sucesso){
        if(!existe.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Pedido enviado não está cadastrado ainda, envie um pedido já cadastrado para continuar!"
            })
            return
        }
    }else{
        res.status(500).json(existe);
        return
    }

    const resposta = await update("mensagens", campos, "idMensagem = ?", [...Object.values(req.body), id]);
    res.status(resposta.status).json(resposta);
}

export async function excluir(req, res){
    const id = req.params.id;
    
    if(!id || !Number(id)){
        res.status(400).json({
            sucesso: false,
            Erro: "Id inválido, envie um id válido para continuar!"
        })
    }
    
    const existe = await selectUnico("idMensagem = ?", id, "mensagens");

    if(existe.sucesso){
        if(!existe.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Mensagem não está cadastrada, envie uma mensagem já cadastrada para continuar!"
            })
            return
        }
    }else{
        res.status(500).json(existe);
        return
    }

    const resposta = await deletar("mensagens", "idMensagem = ?", [id]);
    res.status(resposta.status).json(resposta);
}