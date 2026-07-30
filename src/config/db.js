import mysql from "mysql2/promise";

const db = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "doces_da_vovo_vini"
})

export default db;