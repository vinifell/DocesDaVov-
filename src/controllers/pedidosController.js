import { select } from "../repository/query.js";

export async function get(req, res){
    const resposta = await select("pedidos");
    res.status(resposta.status).json(resposta);
}

export async function post(req, res){
    const { nomeCliente, telefoneCliente } = req.body;

    if(!nomeCliente || !telefoneCliente){
        res.status(400).json({
            sucesso: false,
            Erro: "Dados invalidos, revise e envie-os novamente!"
        })
    }
}