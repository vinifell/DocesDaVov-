const botoes = document.querySelector(".botoes");
const categorias = JSON.parse(localStorage.getItem("categorias"));
const produtos = JSON.parse(localStorage.getItem("produtos"));
console.log(categorias);
console.log(produtos);

if(categorias.length){
    botoes.innerHTML = `<button class="botao selecionado" data-id="-1">Todos</button>`;
    botoes.innerHTML += categorias.map((categoria, i) => `<button class="botao" data-id=${i}>${categoria.nomeCategoria}</button>`).join("");

    let todosBotoes = document.querySelectorAll(".botao");

    botoes.addEventListener('click', (event)=> {

        if(event.target.classList.contains("botao")){
            todosBotoes.forEach(item =>{
                item.classList.remove("selecionado");
            })

            event.target.classList.add("selecionado");

            let selecionado = document.querySelector(".selecionado");

            if(selecionado.dataset.id < 0){
                renderizar(produtos);
            }else{
                let categoriaSelecionada = selecionado.innerText;
                let banco = produtos.filter(item => item.nomeCategoria == categoriaSelecionada) || [];
                renderizar(banco);
            }
        }
        
    })
}

function renderizar(banco){
    const localizacaoProdutos = document.querySelector(".produtos");
    const nenhum = document.querySelector(".nenhumProduto");
    if(banco.length){
        localizacaoProdutos.style.display = "grid";
        nenhum.style.display = "none";

        localizacaoProdutos.innerHTML = banco.map((item, index) => {
            if(item.disponivel === "on")return `
            <li class="produto">
                ${item.url ? `<img class="imagem" src="${item.url}" alt="${item.nomeProduto}">` : `<p class="icon">🍰</p>`}
                <section class="infProduto">
                    <p class="categorias">${item.nomeCategoria.toUpperCase()}</p>
                    <h4>${item.nomeProduto}</h4>
                    <p class="descricao">${item.descricao}</p>
                    <section class="preco_adicionar">
                        <p class="preco">R$${item.preco}</p>
                        <button class="botoesAdicionar" data-id=${index}>+ Adicionar</button>
                    </section>
                </section>
            </li>    
        `}
    
    ).join("");

        const botoesAdicionar = document.querySelectorAll(".botoesAdicionar");
        botoesAdicionar.forEach(botao => {
            botao.addEventListener('click', (event)=>{
                adicionarCarrinho(event.target.dataset.id, banco);
            })
        })
    }else{

        localizacaoProdutos.style.display = "none";
        nenhum.style.display = "flex";
    }
}

function adicionarCarrinho(id, banco){
    console.log(id);

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let passou = false;
    carrinho.forEach((item, index) => {
        if(item.nomeProduto === banco[id].nomeProduto){
            carrinho[index].quantidade++;
            passou = true
        }
    })

    if(!passou) carrinho.push({...banco[id], quantidade: 1});
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado no carrinho com sucesso!")
}

renderizar(produtos);