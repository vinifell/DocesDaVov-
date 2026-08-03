import { deletar, insert, select, selectUnico, update } from "../repository/query.js";

export async function get(req, res){
    const resposta = await select("itens_pedido");
    res.status(resposta.status).json(resposta);
}

export async function post(req, res){
    const { idPedido, idProduto, quantidade } = req.body;

    if(!idPedido, !idProduto, !quantidade, !Number(quantidade)){
        res.status(400).json({
            sucesso: false,
            Erro: "Existe pelo menos um dado inválido, revise-os e tente novamente!"
        });
        return
    }

    const existePedido = await selectUnico("idPedido = ?", idPedido, "pedidos");
    const existeProduto = await selectUnico("idProduto = ?", idProduto, "produtos");

    if(existePedido.sucesso){
        if(!existePedido.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Pedido enviado não existe, tente novamente com um pedido existente"
            })
            return
        }
    }else{
        res.status(500).json(existePedido);
        return
    }

    if(existeProduto.sucesso){
        if(!existeProduto.resposta.length){
            res.status(400).json({
                sucesso: true,
                Erro: "Produto enviado não existe, tente novamente com um produto existente!"
            });
            return
        }
    }else{
        res.status(500).json(existeProduto);
        return
    }

    const resposta = await insert("itens_pedido(idPedido, idProduto, quantidade)", "?, ?, ?", [idPedido, idProduto, quantidade]);
    res.status(resposta.status).json(resposta);
}

export async function put(req, res){
    const id = req.params.id;
    let campos = ["idPedido", "idProduto", "quantidade"];

    for(let i = 3; i>-1; i--){
        if(req.body[campos[i]]){
            campos[i] = campos[i] + " = ?";
        }else{
            campos.splice(i, 1);
        }
    }

    if(!id || !Number(id)){
        res.status(400).json({
            sucesso: false,
            Erro: "Id inválido, insire um id válido para continuar!"
        })
    }

    const existe = await selectUnico("idItemPedido = ?", id, "itens_pedido");
    console.log(id);
    console.log(existe);

    if(existe.sucesso){
        if(!existe.resposta.length){
            res.status(400).json({
                sucesso: false,
                Err0: "Item Pedido ainda não está cadastrado, envie um item ja cadastrado para continuar!"
            })
            return
        }
    }else{
        res.status(500).json(existe);
    }

    if(!campos.length){
        res.status(400).json({
            sucesso: false,
            Erro: "É necessario pelo menos um dado para a edição!"
        })
        return
    }

    let existePedido = { sucesso: true, resposta: ['Olá']};
    if(req.body.idPedido){
        existePedido = await selectUnico("idPedido = ?", req.body.idPedido, "pedidos");
    }

    let existeProduto = { sucesso: true, resposta: ['Olá']};
    if(req.body.idProduto){
        existeProduto = await selectUnico("idProduto = ?", req.body.idProduto, "produtos");
    }

    if(existePedido.sucesso && existeProduto.sucesso){
        if(!existePedido.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Pedido enviado não está cadastrado, envie um pedido já cadastrado para continuar!"
            })
            return
        }

        if(!existeProduto.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Produto enviado não está cadastrado, envie um produto já cadastrado para continuar!"
            })
            return
        }
    }else if(!existePedido.sucesso){
        res.status(500).json(existePedido);
        return
    }else if(!existeProduto.sucesso){
        res.status(500).json(existeProduto);
        return
    }

    const resposta = await update("itens_pedido", campos, "idItemPedido = ?", [...Object.values(req.body), id]);
    res.status(resposta.status).json(resposta);
}

export async function excluir(req, res){
    const id = req.params.id;

    if(!id || !Number(id)){
        res.status(400).json({
            sucesso: false,
            Erro: "Id inválido, insira um id válido e tente novamente!"
        })
    };

    const existe = await selectUnico("idItemPedido = ?", id, "itens_pedido");
    if(existe.sucesso){
        if(!existe.resposta.length){
            res.status(400).json({
                sucesso: false,
                Erro: "Item Pedido enviado não está cadastrado ainda, envie um item Pedido já cadastrado para continuar!"
            });
            return
        }
    }else{
        res.status(500).json(existe);
        return
    }

    const resposta = await deletar("itens_pedido", "idItemPedido = ?", [id]);
    res.status(resposta.status).json(resposta);
}