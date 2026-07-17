import { renderizarTabelas } from "./renderizar.js";

const BtnPedidos = document.querySelector("#pedidos");
const BtnProdutos = document.querySelector("#produtos");
const BtnCategorias = document.querySelector("#categorias");
const cadastrarNovo = document.querySelector(".cadastrarNovo");
const modal = document.querySelector("#modalCategoria");
const cancelar = document.querySelector(".cancelar");
const form = document.querySelector("#meuForm");
const acao = document.querySelector("#acao");
const id = document.querySelector("#id");
let localizacao = localStorage.getItem("localizacao");
let categorias = JSON.parse(localStorage.getItem('categorias')) || [];

BtnPedidos.addEventListener('click', ()=>{
    BtnProdutos.classList.remove("selecionado");
    BtnPedidos.classList.add("selecionado");
    BtnCategorias.classList.remove('selecionado');
    cadastrarNovo.classList.add("escondido");

    localStorage.setItem("localizacao", "pedidos");
    localizacao = pegarLocalizacao();

    renderizar(localizacao);
});

BtnProdutos.addEventListener('click', ()=>{
    BtnProdutos.classList.add("selecionado");
    BtnPedidos.classList.remove("selecionado");
    BtnCategorias.classList.remove('selecionado');
    cadastrarNovo.classList.remove("escondido");

    localStorage.setItem("localizacao", "produtos")
    localizacao = pegarLocalizacao();

    renderizar(localizacao);
});

BtnCategorias.addEventListener('click', ()=>{
    BtnProdutos.classList.remove("selecionado");
    BtnPedidos.classList.remove("selecionado");
    BtnCategorias.classList.add('selecionado');
    cadastrarNovo.classList.remove("escondido");

    localStorage.setItem("localizacao", "categorias")
    localizacao = pegarLocalizacao();

    renderizar(localizacao);
})

modal.addEventListener('click', (event)=>{
    const rect = modal.getBoundingClientRect();

    const clicouDentro = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY <= rect.bottom && event.clientY >= rect.top;

    if(!clicouDentro){
        modal.close();
    }

})

cancelar.addEventListener("click", ()=> {
    form.reset();
    modal.close();
})

form.addEventListener("submit", (event)=>{
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form));
    console.log(data);
    localizacao = pegarLocalizacao();
    let banco = pegarBanco(localizacao);
    if(localizacao === "produtos" && !data.disponivel) data.disponivel = "off";
    if(acao.innerText === "Cadastrar"){
        banco.push(data);
    }else{
        console.log(id.innerText);
        banco[+id.innerText] = data;
        acao.innerText = "Cadastrar";
    }
    
    console.log(banco);
    salvar(banco, localizacao);
    form.reset();
    modal.close();
    renderizar(localizacao);
})

function renderizar(localizacao){
    const cadastrado = document.querySelector("#cadastrados");
    const adicionar = document.querySelector("#adicionar");
    const icone = document.querySelector("#icone");
    const texto = document.querySelector("#texto");
    const nenhum = document.querySelector(".nenhumPedido");
    mudarModal(localizacao);

    let banco = pegarBanco(localizacao);

    if(localizacao !== "pedidos"){
        cadastrado.innerText = `${banco.length} ${localizacao} cadastrad${localizacao == "categorias" ? "a" : "o"}s`;
    }
    const containerTabela = document.querySelector(".containerTabelas");

    if(banco.length){
        containerTabela.style.display = "flex";
        nenhum.style.display = "none";
        renderizarTabelas(localizacao);
    }else{
        containerTabela.style.display = "none";
        nenhum.style.display = "flex";

        switch (localizacao){
            case "pedidos":
                icone.innerText = "📭";
                texto.innerText = "Nenhum pedido recebido ainda";
            break;
            case "produtos":
                adicionar.innerText = "+ Novo produto";
                icone.innerText = "🍰";
                texto.innerText = "Nenhum produto cadastrado ainda";
            break;
            case "categorias":
                adicionar.innerText = "+ Nova categoria";
                icone.innerText = "🏷️";
                texto.innerText = "Nenhuma categoria cadastrada ainda."; 
            break;
        } 
    }
}

function salvar(banco, nome){
    localStorage.setItem(nome, JSON.stringify(banco));
}

function pegarLocalizacao(){
    return localStorage.getItem("localizacao");
}

function pegarBanco(banco){
    return JSON.parse(localStorage.getItem(banco)) || [];
}

export function editar(i){
    modal.show();

    const localizacao = pegarLocalizacao();
    const banco = pegarBanco(localizacao);
    const acao = document.querySelector("#acao");
    const id = document.querySelector("#id");
    acao.innerText = "Edição";
    id.innerText = i;
    
    for(const chave in banco[i]){
        if(chave !== "disponivel" && banco[i].disponivel == "off"){
            document.querySelector(`#${chave}`).value = banco[i][chave];
        }else{
            document.querySelector("#disponivel").checked = false
        }
    }
}

export function excluir(i){
    const localizacao = pegarLocalizacao();
    const banco = pegarBanco(localizacao);

    const titulo = document.querySelector("#tituloExcluir");
    const mensagem = document.querySelector("#mensagem");
    const categoria = document.querySelector("#Categoria");

    titulo.innerText = templatesCerteza[localizacao].titulo;
    mensagem.innerText = templatesCerteza[localizacao].mensagem;
    categoria.innerText = banco[i][templatesCerteza[localizacao].nome];
    
    const modalCerteza = document.querySelector("#modalCerteza");
    modalCerteza.addEventListener('click', (event) => {
        if(event.target.classList.contains("cancelar")){
            modalCerteza.close();
        }

        if(event.target.classList.contains("excluir")){
            banco.splice(i, 1);
            salvar(banco, localizacao);
            renderizar(localizacao);
            modalCerteza.close();
        }
    })
}

function mudarModal(localizacao){
    if(localizacao === "pedidos") return;

    const titulo = document.querySelector("#tituloNova");
    titulo.innerHTML = modalTemplate[localizacao].titulo;
    form.innerHTML = modalTemplate[localizacao].template;
    modal.style.height = modalTemplate[localizacao].height;

    if(localizacao === "produtos") preencherSelect();
}

function preencherSelect(){
    const select = document.querySelector("#nomeCategoria");
    const categorias = pegarBanco("categorias");
    if(categorias.length){
        select.innerHTML = `<option value="">Selecione uma opção:</option>`;
        select.innerHTML += categorias.map(item => `<option value="${item.nomeCategoria}">${item.nomeCategoria}</option>`);
    }
}

const modalTemplate = {
    produtos: {
        titulo: "Novo produto",
        template: `
            <section class="inputs">
                <section class="linhaUnica input">
                    <label for="nomeProduto">NOME</label>
                    <input type="text" id="nomeProduto" name="nomeProduto" placeholder="Ex: Bolo de Chocolate" required>
                </section>
                <section class="input">
                    <label for="nomeCategoria">CATEGORIA</label>
                    <select name="nomeCategoria" id="nomeCategoria" required>
                        <option value="">Cadastre uma categoria para continuar</option>
                    </select>
                </section>
                <section class="input">
                    <label for="preco">PREÇO (R$)</label>
                    <input type="number" id="preco" name="preco" placeholder="0,00" required>
                </section>
                <section class="linhaUnica input">
                    <label for="descricao">DESCRICAO</label>
                    <textarea name="descricao" id="descricao" placeholder="Breve descrição do produto"></textarea>
                </section>
                <section class="linhaUnica input">
                    <label for="url">URL DA IMAGEM (OPCIONAL)</label>
                    <input type="text" id="url" name="url" placeholder="https://...">
                </section>
                <section class="disponivel">
                    <input type="checkbox" name="disponivel" id="disponivel" checked>
                    <label for="disponivel">Disponivel para venda</label>
                </section>
            </section>
            <section class="botoes">
                <button type="button" class="cancelar">Cancelar</button>
                <button type="submit" class="salvar">Salvar produto</button>
            </section>`,
        height: "62vh"
    },
    categorias: {
        titulo: "Nova categoria",
        template: `
            <section class="inputs">
                <section class="linhaUnica input">
                    <label for="nomeCategoria">NOME</label>
                    <input type="text" id="nomeCategoria" name="nomeCategoria" placeholder="Ex: Bolos" required>
                </section>
            </section>
            <section class="botoes">
                <button type="button" class="cancelar">Cancelar</button>
                <button type="submit" class="salvar">Salvar categoria</button>
            </section>`,
        height: "25vh"
    }
}

const templatesCerteza = {
    pedidos: ` `,
    produtos: {
        nome: "nomeProduto",
        mensagem: "Deseja realmente excluir o produto abaixo?",
        titulo: "Excluir Produto"
    },
    categorias: {
        nome: "nomeCategoria",
        mensagem: "Deseja realmente excluir a categoria abaixo?",
        titulo: "Excluir Categoria"
    }
}