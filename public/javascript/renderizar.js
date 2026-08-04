import { editar, excluir, preencherModal, pegarBanco, pegarChavesEstrangeiras } from "./admin.js";

export async function renderizarTabelas(localizacao){
    let resposta = await pegarBanco(localizacao);
    let dados = resposta.response;
    let banco = await pegarChavesEstrangeiras(localizacao, dados);
    const tabela = document.querySelector("#tabela");
    tabela.innerHTML = templateHeader[localizacao];

    //Conectar front com Back
    //trocar os id pelos nomes
    tabela.innerHTML += banco.map((data, index) => templates[localizacao](data, index)).join("");


    tabela.addEventListener('click', (e) => {
        if(e.target.classList.contains("editar")){
            editar(e.target.dataset.id);
        }

        if(e.target.classList.contains("deletar")){
            excluir(e.target.dataset.id);
        }
        
        if(e.target.classList.contains("verItens")){
            preencherModal(e.target.dataset.id);
        }
    })    
}

const templateHeader = {
    pedidos: `
        <tr>
            <th>#</th>
            <th>CLIENTE</th>
            <th>TELEFONE</th>
            <th>RECEBIDO EM</th>
            <th>STATUS</th>
            <th></th>
        </tr>
    `,
    produtos: `
        <tr class="tabelaProdutos">
            <th>NOME</th>
            <th>CATEGORIA</th>
            <th>PRECO</th>
            <th>STATUS</th>
            <th></th>
        </tr>
    `,
    categorias: `
        <tr class="tabelaCategorias">
            <th>NOME</th>
            <th></th>
        </tr>
    `
}

const templates = {
    pedidos: (item, i) => `
        <tr class="data">
            <td>#${item.cliente.idPedido}</td>
            <td>${item.cliente.nomeCliente}</td>
            <td>${item.cliente.telefoneCliente}</td>
            <td>${item.hora}</td>
            <td>
                <select name="status" id="status">
                    <option value="novo">Novo</option>
                    <option value="andamento">Em andamento</option>
                    <option value="concluido">Concluído</option>
                </select>
            </td>
            <td><button commandFor="detalhesPedido" command="show-modal" data-id="${item.idPedido}" class="verItens">Ver itens</button></td>
        </tr>
    `,
    produtos: (item, i) => `
        <tr class="tabelaProdutos">
            <td>${item.nomeProduto}</td>
            <td>${item.nomeCategoria}</td>
            <td>R$${item.preco}</td>
            <td class="${item.disponivel == 1 ? "on" : "off"}">${item.disponivel == 1? "Disponivel": "Indisponível"}</td>
            <td>                
                <section>
                    <button class="editar" data-id=${item.idProduto} commandfor="modalCategoria" command="show-modal">Editar</button>
                    <button class="deletar" data-id=${item.idProduto} command="show-modal" commandFor="modalCerteza">Excluir</button>
                </section>
            </td>
        </tr>
    `,
    categorias: (item, i) => `
        <tr class="tabelaCategorias">
            <td>${item.nomeCategoria}</td>
            <td>
                <section>
                    <button class="editar" data-id=${item.idCategoria} commandfor="modalCategoria" command="show-modal">Editar</button>
                    <button class="deletar" data-id=${item.idCategoria} command="show-modal" commandFor="modalCerteza">Excluir</button>
                </section>
            </td>
        </tr>
    `
}