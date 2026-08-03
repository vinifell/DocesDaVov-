import { deletar, insert, select, selectUnico, update } from "../repository/query.js";
import { formatarTelefone } from "../services/utils.js";

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

    let numeroFormatado = formatarTelefone(telefoneCliente);

    if(!numeroFormatado){
        res.status(400).json({
            sucesso: false,
            Erro: "Número inválido, tente novamente com um número válido!"
        })
        return
    }

    const resposta = await insert("pedidos(nomeCliente, telefoneCliente)", "?, ?", [nomeCliente, numeroFormatado]);
    res.status(resposta.status).json(resposta);
}

export async function put(req, res){
    const id = req.params.id;
    let campos = ["nomeCliente", "telefoneCliente"];
    for(let index=2; index>-1; index--){
        if(req.body[campos[index]]){
            campos[index] = campos[index] + " = ?";
        }else{
            campos.splice(index, 1);
        }
    }

    if(!campos.length){ 
        res.status(400).json({
            sucesso: false,
            Erro: "É necessario pelo menos um item para a edição!"
        })
        return
    }

    if(req.body.telefoneCliente) req.body.telefoneCliente = formatarTelefone(req.body.telefoneCliente);

    if(!req.body.telefoneCliente){
        res.status(400).json({
            sucesso: false,
            Erro: "Número inválido, tente novamente com um número válido!"
        })
        return
    }

    const pedidoAntigo = await selectUnico("idPedido = ?", id, "pedidos");

    if(!id || !Number(id)){
        res.status(400).json({
            sucesso: false,
            Erro: "Id inválido, envie um id válido para continuar"
        })
        return
    }else if(!pedidoAntigo.sucesso){
        res.status(500).json(pedidoAntigo);
        return
    }else if(!pedidoAntigo.resposta.length){
        res.status(400).json({
            sucesso: false,
            Erro: "Pedido enviado não existe, envie o id de um pedido já cadastrado para continuar!"
        })
        return
    }

    const resposta = await update("pedidos", campos, "idPedido = ?", [ ...Object.values(req.body), id]);
    res.status(resposta.status).json(resposta);
}

export async function excluir(req, res){
    const id = req.params.id;

    if(!id || !Number(id)){
        res.status(400).json({
            sucesso: false,
            Erro: "Id inválido, envia um id válido para continuar!"
        })
        return
    }

    let possui = await selectUnico("idPedido = ?", [id], "mensagens");

    if(possui.sucesso){
        if(possui.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Existe pelo menos uma mensagem cadastrada neste pedido, É necessario excluir a mensagem primeiro antes de excluir este pedido!"
            })
            return
        }
    }else{
        res.status(500).json(possui);
        return
    }

    possui = await selectUnico("idPedido = ?", [id], "itens_pedido");

    if(possui.sucesso){
        if(possui.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Existe itens cadastrados neste pedido, É necessario excluir os itens primeiro antes de excluir este pedido!"
            })
            return
        }
    }else{
        res.status(500).json(possui);
        return
    }

    const pedidoAntigo = await selectUnico("idPedido = ?", id, "pedidos");
    if(!pedidoAntigo.resposta.length){
        res.status(400).json({
            sucesso: false,
            Erro: "Pedido não existe, envie um pedido já cadastrado para continuar!"
        })
        return
    }

    const resposta = await deletar("pedidos", "idPedido = ?", [id]);
    res.status(resposta.status).json(resposta);
}