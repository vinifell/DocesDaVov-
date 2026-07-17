import { editar, excluir } from "./admin.js";

export function renderizarTabelas(localizacao){
    let banco = JSON.parse(localStorage.getItem(localizacao));
    const tabela = document.querySelector("#tabela");

    tabela.innerHTML = templateHeader[localizacao];
    tabela.innerHTML += banco.map((data, index) => templates[localizacao](data, index)).join("");
    tabela.addEventListener('click', (e) => {
        if(e.target.classList.contains("editar")){
            editar(e.target.dataset.id);
        }

        if(e.target.classList.contains("deletar")){
            excluir(e.target.dataset.id);
        }
    })    
}

const templateHeader = {
    pedidos: `
        <p>Testando Pedidos</p>
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
    pedidos: `
    
    `,
    produtos: (item, i) => `
        <tr class="tabelaProdutos">
            <td>${item.nomeProduto}</td>
            <td>${item.nomeCategoria}</td>
            <td>R$${item.preco}</td>
            <td class="${item.disponivel}">${item.disponivel == "on"? "Disponivel": "Indisponível"}</td>
            <td>                
                <section>
                    <button class="editar" data-id=${i}>Editar</button>
                    <button class="deletar" data-id=${i} command="show-modal" commandFor="modalCerteza">Excluir</button>
                </section>
            </td>
        </tr>
    `,
    categorias: (item, i) => `
        <tr class="tabelaCategorias">
            <td>${item.nomeCategoria}</td>
            <td>
                <section>
                    <button class="editar" data-id=${i}>Editar</button>
                    <button class="deletar" data-id=${i} command="show-modal" commandFor="modalCerteza">Excluir</button>
                </section>
            </td>
        </tr>
    `
}