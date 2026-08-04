import { renderizarTabelas } from "./renderizar.js";
import { separarArquivos } from "./utils.js";

const BtnPedidos = document.querySelector("#pedidos");
const BtnProdutos = document.querySelector("#produtos");
const BtnCategorias = document.querySelector("#categorias");
const cadastrarNovo = document.querySelector(".cadastrarNovo");
const modal = document.querySelector("#modalCategoria");
const form = document.querySelector("#meuForm");
const acao = document.querySelector("#acao");
const id = document.querySelector("#id");
localStorage.setItem("localizacao", "pedidos");
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

modal.addEventListener('click', async (event)=>{
    const rect = modal.getBoundingClientRect();

    const clicouDentro = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY <= rect.bottom && event.clientY >= rect.top;

    if(!clicouDentro){
        modal.close();
    }

})

form.addEventListener("submit", (event)=>{
    event.preventDefault();

    console.log("Ouviu submit!");
    
    let data = Object.fromEntries(new FormData(form));
    console.log(data);
    localizacao = pegarLocalizacao();
    // let banco = await pegarBanco(localizacao);
    if(localizacao === "produtos" && !data.disponivel) data.disponivel = "off";
    const resposta = salvar(data, localizacao);
    form.reset();
    modal.close();
    if(localizacao === "pedidos") preencherModal(id.innerText);
    renderizar(localizacao);
})

async function renderizar(localizacao){
    const cadastrado = document.querySelector("#cadastrados");
    const adicionar = document.querySelector("#adicionar");
    const icone = document.querySelector("#icone");
    const texto = document.querySelector("#texto");
    const nenhum = document.querySelector(".nenhumPedido");
    mudarModal(localizacao);

    let resposta = await pegarBanco(localizacao);
    if(!resposta.sucesso){
        alert(resposta.Erro);
        return
    }
    let banco = resposta.response;

    if(localizacao !== "pedidos"){
        cadastrado.innerText = `${banco.length} ${localizacao} cadastrad${localizacao == "categorias" ? "a" : "o"}s`;
        adicionar.innerText = `Nov${localizacao == "categorias" ? "a" : "o"} ${localizacao == "categorias" ? "categoria" : "produto"}`;
    }
    const containerTabela = document.querySelector(".containerTabelas");

    if(banco.length){
        containerTabela.style.display = "flex";
        nenhum.style.display = "none";
        await renderizarTabelas(localizacao);
    }else{
        containerTabela.style.display = "none";
        nenhum.style.display = "flex";

        switch (localizacao){
            case "pedidos":
                icone.innerText = "📭";
                texto.innerText = "Nenhum pedido recebido ainda";
            break;
            case "produtos":
                icone.innerText = "🍰";
                texto.innerText = "Nenhum produto cadastrado ainda";
            break;
            case "categorias":
                icone.innerText = "🏷️";
                texto.innerText = "Nenhuma categoria cadastrada ainda."; 
            break;
        } 
    }
}

async function salvar(dados, localizacao){
    if(acao.innerText == "Cadastrar"){
        let resposta;
        console.log(localizacao);
        if(localizacao !== "produtos" && localizacao !== "pedidos"){
            console.log("Entrou!")
            // resposta = await fetch(`http://localhost:3000/${localizacao}`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(dados)
            // });
        }else if(localizacao === "produtos"){
            separarArquivos(dados);
        }
        const respostaFormatada = await resposta.json();
        return respostaFormatada;
    }else{
        const resposta = await fetch(`http://localhost:3000/${localizacao}/${+id.innerText}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
        acao.innerText = "Cadastrar";
        const respostaFormatada = await resposta.json();
        return respostaFormatada;
    }
}

function pegarLocalizacao(){
    return localStorage.getItem("localizacao");
}

export async function pegarBanco(banco){
    const resposta = await fetch(`http://localhost:3000/${banco}`);
    const data = await resposta.json();
    return data
}

export async function pegarChavesEstrangeiras(localizacao, banco) {
    if(localizacao == "produtos"){
        const respostaCategorias = await fetch(`http://localhost:3000/categorias`);
        const respostaDescricao = await fetch(`http://localhost:3000/descricao`);
        const respostaUrl = await fetch(`http://localhost:3000/urlsProdutos`);
        const categorias = (await respostaCategorias.json()).response;
        const descricoes = (await respostaDescricao.json()).response;
        const urlsProdutos = (await respostaUrl.json()).response;

        banco.forEach(dado => {
            categorias.forEach(categoria => {
                if(categoria.idCategoria === dado.idCategoria){
                    dado.nomeCategoria = categoria.nomeCategoria;
                }
            })
            descricoes.forEach(descricao => {
                if(dado.idProduto === descricao.idProduto){
                    dado.descricao = descricao.descricao;
                }
            })
            urlsProdutos.forEach(url => {
                if(url.idProduto === dado.idProduto){
                    dado.url = url.url;
                }
            })
        });

        return banco;
    }

    if(localizacao == "categorias"){
        return banco;
    }

    if(localizacao == "pedidos"){
        const respostaMensagens = await fetch(`http://localhost:3000/mensagens`);
        const respostaItens = await fetch(`http://localhost:3000/itens`);
        const respostaProdutos = await fetch(`http://localhost:3000/produtos`);
        const mensagens = (await respostaMensagens.json()).response;
        const itens = (await respostaItens.json()).response;
        const data = (await respostaProdutos.json()).response;
        const produtos = await pegarChavesEstrangeiras("produtos", data);
        let NovoBanco = [];
        banco.forEach(pedido => {
            let hora = pedido.recebidoEm.replace(/\D/g, "");
            hora = hora.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{5})/, "$3/$2/$1, $4:$5");
            NovoBanco.push({cliente: pedido, hora: hora});
            
        });

        let NovoItens = [];
        NovoBanco.forEach(pedido => {
            pedido.produtos = [];
            mensagens.forEach(mensagem => {
                if(pedido.cliente.idPedido === mensagem.idPedido){
                    pedido.cliente.mensagem = mensagem.mensagem;
                }
            });

            itens.forEach(item => {
                let obj = {};
                produtos.forEach(produto =>{
                    if(produto.idProduto === item.idProduto){
                        obj = {...produto, quantidade: item.quantidade};
                    }
                });

                if(pedido.cliente.idPedido === item.idPedido){
                    pedido.produtos.push(obj);
                }
            });

        });
        return NovoBanco;
    }
}

export async function editar(i){

    const localizacao = pegarLocalizacao();
    const dados = await pegarBanco(localizacao);
    if(!dados.sucesso){
        alert(dados.Erro);
        return
    }
    const banco = await pegarChavesEstrangeiras(localizacao, dados.response);
    const acao = document.querySelector("#acao");
    const id = document.querySelector("#id");
    acao.innerText = "Edição";
    id.innerText = i;
    let dado = {};
    banco.forEach(data => {
        if(localizacao === "produtos" && data.idProduto === i){
            dado = data;
        }

        if(localizacao === "pedidos" && data.idPedido === i){
            dado = data;
        }

        if(localizacao === "categorias" && Number(data.idCategoria) === Number(i)){
            dado = data;
        }
    });
    for(const chave in dado){
        if(chave !== "disponivel"){
            if(chave !== "idCategoria" && chave !== "idPedido" && chave !== "idProduto"){
                document.querySelector(`#${chave}`).value = dado[chave];
            }
        }else{
            if(banco[i].disponivel === 1){
                document.querySelector("#disponivel").checked = true;
            }else{
                document.querySelector("#disponivel").checked = false;
            }
        }
    }

    if(localizacao === "pedidos"){
        const total = document.querySelector("#total");
        const valorTotal = calcularTotal(banco[i].produtos);
        total.innerText = "R$" + valorTotal.toFixed(2);
    }
}

export async function excluir(i){
    const localizacao = pegarLocalizacao();
    const banco = (await pegarBanco(localizacao)).response;

    let bancoEscolhido = {};
    banco.forEach(data =>{
        if(data.idCategoria == i){
            bancoEscolhido = data;
        }
    });

    const titulo = document.querySelector("#tituloExcluir");
    const mensagem = document.querySelector("#mensagem");
    const categoria = document.querySelector("#Categoria");

    titulo.innerText = templatesCerteza[localizacao].titulo;
    mensagem.innerText = templatesCerteza[localizacao].mensagem;
    categoria.innerText = "Pedido #" + i;
    if(localizacao !== "pedidos")categoria.innerText = bancoEscolhido[templatesCerteza[localizacao].nome];
    
    const modalCerteza = document.querySelector("#modalCerteza");
    modalCerteza.addEventListener('click', async (event) => {
        if(event.target.classList.contains("cancelar")){
            modalCerteza.close();
        }

        if(event.target.classList.contains("excluir")){
            const resposta = await fetch(`http://localhost:3000/${localizacao}/${i}`, {
                method: "DELETE"
            });
            const resultado = await resposta.json();
            if(resultado.sucesso){
                alert("Categoria excluida com sucesso!")
                renderizar(localizacao);
                modalCerteza.close();
                if(localizacao === "pedidos"){
                    const modal = document.querySelector("#detalhesPedido");
                    modal.close();
                }
            }else{
                alert(resultado.Erro);
            }
        }
    })
}

function mudarModal(localizacao){
    const titulo = document.querySelector("#tituloNova");
    titulo.innerHTML = modalTemplate[localizacao].titulo;
    form.innerHTML = modalTemplate[localizacao].template;
    modal.style.height = modalTemplate[localizacao].height;

    const cancelar = document.querySelector(".cancelar"); 

    cancelar.addEventListener("click", ()=> {
        form.reset();
        modal.close();
        acao.innerText = "Cadastrar";
    })

    if(localizacao === "produtos") preencherSelect();
}

async function preencherSelect(){
    const select = document.querySelector("#nomeCategoria");
    const categorias = await pegarBanco("categorias");
    if(categorias.response.length){
        select.innerHTML = `<option value="">Selecione uma opção:</option>`;
        select.innerHTML += categorias.response.map(item => `<option value="${item.nomeCategoria}">${item.nomeCategoria}</option>`);
    }
}

export async function preencherModal(i){
    const modal = document.querySelector("#detalhesPedido");
    const dadosCliente = document.querySelector(".dadosCliente");
    const itens = document.querySelector(".itens");
    const total = document.querySelector("#totalDetalhes");
    const botoes = document.querySelector("#botoesDetalhes");
    const data = (await pegarBanco("pedidos")).response;
    const pedidos = await pegarChavesEstrangeiras("pedidos", data);
    let alturaModal = 350;
    let precoTotal = 0;

    const cliente = pedidos[i].cliente;
    const produtos = pedidos[i].produtos;

    dadosCliente.innerHTML = "";
    dadosCliente.innerHTML = `
        <p class="nome" id="nome"><span>Cliente: </span> ${cliente.nomeCliente}</p>
        <p class="Telefone" id="telefone"><span>Telefone: </span>${cliente.telefoneCliente}</p>
    `

    if(cliente.mensagem){
        dadosCliente.innerHTML += `<p><span>Mensagem: </span>${cliente.mensagem}</p>`;
        alturaModal += 21;
    }

    itens.innerHTML = ""
    itens.innerHTML += produtos.map(produto => `
        <section class="item">
            <p>${produto.quantidade}x ${produto.nomeProduto}</p>
            <p>R$${produto.quantidade * produto.preco}</p>
        </section>`).join("");

    if(produtos.length > 1){
        alturaModal += 31 * (produtos.length - 1);
    }

    produtos.forEach(produto => {
        precoTotal += (produto.preco * produto.quantidade);
    });

    botoes.innerHTML = `
        <button class="excluir" data-id=${i} command="show-modal" commandFor="modalCerteza">Excluir</button>
        <button class="editar" data-id=${i} commandfor="modalCategoria" command="show-modal">Editar</button>
        <button class="cancelar fechar" commandFor="detalhesPedido" command="close" data-id=${i}>Fechar</button>`;

    botoes.addEventListener('click', (event) =>{
        if(event.target.classList.contains("editar")){
            editar(event.target.dataset.id);

            let banco = pegarBanco("pedidos");
            const produtos = banco[i].produtos
            const pedidos = document.querySelector(".pedidos");
            pedidos.innerHTML = produtos.map((item, index) => `
                <li class="pedido">
                    <section class="dadosPedido">
                        <h4>${item.nomeProduto}</h4>
                        <p>R$${item.preco} cada</p>
                    </section>
                    <section class="deletarPedidos">
                        <div class="botoesPedidos">
                            <button type="button" class="diminuir" data-id=${index}>-</button>
                            <p id="PrQ${index}">${item.quantidade}</p>
                            <button type="button" class="adicionar" data-id=${index}>+</button>
                        </div>
                        <button type="button" class="lixeira" data-id=${index}>🗑</button>
                    </section>
                </li>
            `).join("");

            const buttonsAdicionar = document.querySelectorAll(".adicionar");
            const buttonsDiminuir = document.querySelectorAll(".diminuir");
            const lixeiras = document.querySelectorAll(".lixeira");
            let produtosEdicao = produtos;
            localStorage.setItem("produtosEdicao", JSON.stringify(produtosEdicao));

            buttonsAdicionar.forEach(button => {
                button.addEventListener("click", (event)=>{
                    let id = event.target.dataset.id;
                    let produtosEdicao = JSON.parse(localStorage.getItem("produtosEdicao"));

                    const quantidade = document.querySelector(`#PrQ${id}`);
                    quantidade.innerText++;
                    produtosEdicao[id].quantidade++;
                    salvar(produtosEdicao, "produtosEdicao");

                    const totalEdicao = document.querySelector("#total");
                    totalEdicao.innerText = "R$" + calcularTotal(produtosEdicao).toFixed(2);
                })
            })

            buttonsDiminuir.forEach(button => {
                button.addEventListener("click", (event)=>{
                    let id = event.target.dataset.id;
                    let produtosEdicao = JSON.parse(localStorage.getItem("produtosEdicao"));

                    const quantidade = document.querySelector(`#PrQ${id}`);
                    if(quantidade.innerText > 1){
                        quantidade.innerText--;
                        produtosEdicao[id].quantidade--;
                        salvar(produtosEdicao, "produtosEdicao");
                    }else{
                        console.log("Chegou a 0")
                    }
                    
                    const totalEdicao = document.querySelector("#total");
                    totalEdicao.innerText = "R$" + calcularTotal(produtosEdicao).toFixed(2);
                })
            })

            lixeiras.forEach(lixeira => {
                lixeira.addEventListener("click", (event)=>{
                    let id = event.target.dataset.id;
                    let produtosEdicao = JSON.parse(localStorage.getItem("produtosEdicao"));

                    produtosEdicao.splice(id, 1);
                    salvar(produtosEdicao, "produtosEdicao");

                    pedidos.innerHTML = produtosEdicao.map((item, index) => `
                        <li class="pedido">
                            <section class="dadosPedido">
                                <h4>${item.nomeProduto}</h4>
                                <p>R$${item.preco} cada</p>
                            </section>
                            <section class="deletarPedidos">
                                <div class="botoesPedidos">
                                    <button type="button" class="diminuir" data-id=${index}>-</button>
                                    <p id="PrQ${index}">${item.quantidade}</p>
                                    <button type="button" class="adicionar" data-id=${index}>+</button>
                                </div>
                                <button type="button" class="lixeira" data-id=${index}>🗑</button>
                            </section>
                        </li>
                    `).join("");
                    
                    const totalEdicao = document.querySelector("#total");
                    totalEdicao.innerText = "R$" + calcularTotal(produtosEdicao).toFixed(2);
                })
            })
        }

        if(event.target.classList.contains("excluir")){
            excluir(event.target.dataset.id);
        }

    })


    total.innerText = "R$" + calcularTotal(produtos).toFixed(2);
    
    modal.style.height = alturaModal + "px";
}

function calcularTotal(banco){
    let valorTotal = 0
    banco.forEach(item => valorTotal += (item.preco * item.quantidade));
    return valorTotal;
}

const modalTemplate = {
    pedidos: {
        titulo: "Editar Pedido",
        template: `
            <section class="inputs">
                <h2 class="linhaUnica titulo">Cliente:</h2>
                <section class="input">
                    <label for="nome">NOME</label>
                    <input type="text" id="nome" name="nome" placeholder="Ex: Vinicius Fellipe Silva" required>
                </section>
                <section class="input">
                    <label for="telefone">TELEFONE</label>
                    <input type="number" name="telefone" id="telefone" required>
                </section>
                <section class="linhaUnica input">
                    <label for="mensagem">Mensagem</label>
                    <textarea name="mensagem" id="mensagem" placeholder="Breve descrição do produto"></textarea>
                </section>
                <h2 class="titulo">Produtos: </h2>
                <section class="linhaUnica campos">
                    <ul class="pedidos">
                    </ul>
                    <section class="total">
                            <h3 class="testando">Total</h3>
                            <p id="total">R$ 100,00</p>
                    </section>
                </section>
            </section>
            <section class="botoes">
                <button type="button" class="cancelar">Cancelar</button>
                <button type="submit" class="salvar">Salvar produto</button>
            </section>`,
        height: "70vh"
    },
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
                    <input type="number" id="preco" name="preco" placeholder="0.00" step="0.01" required>
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
    pedidos: {
        mensagem: "Deseja realmente excluir o pedido abaixo",
        titulo: "Excluir Pedido"
    },
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

localizacao = pegarLocalizacao();

renderizar(localizacao);