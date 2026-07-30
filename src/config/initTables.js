import mysql from "mysql2/promise";

const infId = "INT PRIMARY KEY AUTO_INCREMENT NOT NULL"

export async function initTable(){
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1234",
        database: "doces_da_vovo_vini"
    })

    await connection.query(`CREATE TABLE IF NOT EXISTS categorias(
            idCategoria ${infId},
            nomeCategoria VARCHAR(45) NOT NULL
        )`
    );

    await connection.query(`CREATE TABLE IF NOT EXISTS produtos(
            idProduto ${infId},
            nomeProduto VARCHAR(45) NOT NULL,
            preco DECIMAL(10, 2) NOT NULL,
            disponivel TINYINT NOT NULL,
            idCategoria INT NOT NULL,

            FOREIGN KEY (idCategoria) REFERENCES categorias(idCategoria)
        )`
    );

    await connection.query(`CREATE TABLE IF NOT EXISTS descricao(
            idDescricao ${infId},
            descricao TEXT NOT NULL,
            idProduto INT NOT NULL,

            FOREIGN KEY (idProduto) REFERENCES produtos(idProduto)
        )`
    );

    await connection.query(`CREATE TABLE IF NOT EXISTS urlProduto(
            idUrlProduto ${infId},
            url TEXT NOT NULL,
            idProduto INT NOT NULL,

            FOREIGN KEY (idProduto) REFERENCES produtos(idProduto)
        )
    `);

    await connection.query(`CREATE TABLE IF NOT EXISTS pedidos(
            idPedido ${infId},
            nomeCliente VARCHAR(45) NOT NULL,
            telefoneCliente VARCHAR(15) NOT NULL,
            recebidoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await connection.query(`CREATE TABLE IF NOT EXISTS mensagens(
            idMensagem ${infId},
            mensagem TEXT NOT NULL,
            idPedido INT NOT NULL,

            FOREIGN KEY (idPedido) REFERENCES pedidos(idPedido)
        )
    `);

    await connection.query(`CREATE TABLE IF NOT EXISTS itens_pedido(
            idItemPedido ${infId},
            idPedido INT NOT NULL,
            idProduto INT NOT NULL,
            quantidade INT NOT NULL,

            FOREIGN KEY (idPedido) REFERENCES pedidos(idPedido),
            FOREIGN KEY (idProduto) REFERENCES produtos(idProduto)
        )
    `);
}