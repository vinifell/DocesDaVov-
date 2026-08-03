import { response } from "express";
import { select, insert, selectUnico, update, deletar } from "../repository/query.js";
//import { naoVazio } from "../services/utils.js";

export async function get(req, res){
    const categorias = await select("categorias");
    if(categorias.sucesso){
        res.status(200).json({
            sucesso: true,
            categorias: categorias.response
        });
    }else{
        res.status(500).json(categorias);
    }
}

export async function post(req, res){
    const { nomeCategoria } = req.body;
    if(nomeCategoria){
        const resposta = await insert("categorias(nomeCategoria)", "?", [nomeCategoria]);
        console.log(resposta);
        if(resposta.sucesso){
            res.status(200).json(resposta);
        }else{
            res.status(500).json(resposta);
        }
    }else{
        res.status(400).json({
            Erro: "Dados invalidos"
        })
    }

}

export async function put(req, res){
    const { nomeCategoria } = req.body;
    const id = req.params.id;
    const existe = await selectUnico("idCategoria = ?", [id], "categorias");
    console.log(existe)
    if(existe.sucesso){
        if(nomeCategoria && existe.resposta.length){
            const resposta = await update("categorias", "nomeCategoria = ?", "idCategoria = ?", [nomeCategoria, id]);
            if(resposta.sucesso){
                res.status(200).json(resposta)
            }else{
                res.status(500).json(resposta);
            }
        }else{
            res.status(400).json({
                sucesso: false,
                Erro: "Dados Inválidos"
            })
        }
    }else{
        res.status(500).json(existe);
    }
    res.end();
}

export async function excluir(req, res) {
    const id = req.params.id;
    const existe = await selectUnico("idCategoria = ?", [id], "categorias");
    console.log(existe);

    const possui = await selectUnico("idCategoria = ?", [id], "produtos");

    if(possui.sucesso){
        if(possui.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Existe um produto cadastrado nessa categoria, É necessario excluir o produto primeiro antes de excluir a categoria!"
            })
            return
        }
    }else{
        res.status(500).json(possui);
    }

    if(existe.sucesso){
        if(existe.resposta.length){
            const resposta = await deletar("categorias", "idCategoria = ?", [id]);
            if(resposta.sucesso){
                res.status(200).json(resposta);
            }else{
                res.status(500).json(resposta);
            }
        }else{
            res.status(400).json({
                sucesso: false,
                Erro: "Dados inválidos"
            })
        }
    }else{
        res.status(500).json(existe)
    }
}