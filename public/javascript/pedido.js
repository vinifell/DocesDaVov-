let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
const pedidosTabela = JSON.parse(localStorage.getItem("pedidos")) || [];
const pedidos = document.querySelector(".pedidos");
const vazio = document.querySelector(".vazio");
const possui = document.querySelector(".possui");
const form = document.querySelector("#meuForm");

console.log(pedidosTabela);
renderizar();

form.addEventListener("submit", (event)=>{
    event.preventDefault();

    let cliente = Object.fromEntries(new FormData(form));
    
    console.log(cliente);
    console.log(carrinho);

    let pedido = {
        cliente,
        produtos: carrinho
    }

    pedidosTabela.push(pedido);
    salvar(pedidosTabela, "pedidos");
    alert("Pedido enviado com sucesso!");
    form.reset();
    carrinho = [];
    salvar(carrinho, "carrinho");
    renderizar();
})

function renderizar(){
    if(carrinho.length){
        possui.style.display = "flex";
        vazio.style.display = "none";

        pedidos.innerHTML = "";
        pedidos.innerHTML += carrinho.map((item, index) => `
                <li class="pedido">
                    <section class="dadosPedido">
                        <h4>${item.nomeProduto}</h4>
                        <p>R${item.preco} cada</p>
                    </section>
                    <section class="deletar">
                        <div class="botoes">
                            <button class="diminuir" data-id=${index}>-</button>
                            <p>${item.quantidade}</p>
                            <button class="adicionar" data-id=${index}>+</button>
                        </div>
                        <button class="lixeira" data-id=${index}>🗑</button>
                    </section>
                </li>
        `).join("");
        let total = document.querySelector("#total");
        let valorTotal = 0;
        
        carrinho.forEach(item => {
            valorTotal = valorTotal + (item.quantidade * item.preco);
        });
        total.innerText = `R$${valorTotal.toFixed(2)}`;

        const buttonsAdicionar = document.querySelectorAll(".adicionar");
        const buttonsDiminuir = document.querySelectorAll(".diminuir");
        const lixeiras = document.querySelectorAll(".lixeira");

        buttonsAdicionar.forEach(button => {
            button.addEventListener("click", (event) =>{
                let id = event.target.dataset.id;
                carrinho[id].quantidade++;
                salvar(carrinho, "carrinho");
                renderizar();
            })
        })

        buttonsDiminuir.forEach(button => {
            button.addEventListener('click', (event) => {
                let id = event.target.dataset.id;
                carrinho[id].quantidade--;
                if(carrinho[id].quantidade !== 0){
                    salvar(carrinho, "carrinho");
                    renderizar();
                }else{
                    carrinho.splice(id, 1);
                    salvar(carrinho, "carrinho");
                    renderizar();
                }
            })
        })

        lixeiras.forEach(button => {
            button.addEventListener('click', (event) => {
                let id = event.target.dataset.id;
                carrinho.splice(id, 1);
                console.log(carrinho);
                salvar(carrinho, "carrinho");
                renderizar();
            })
        })
    }else{
        vazio.style.display = "flex";
        possui.style.display = "none"
    }
}

function salvar(banco, nome){
    localStorage.setItem(nome, JSON.stringify(banco));
}