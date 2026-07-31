import db from "../config/db.js";

export async function select(banco){
    try{
        const [response] = await db.query(`SELECT * FROM ${banco}`);
        return {
            sucesso: true,
            status: 200,
            response 
        }
    }catch(error){
        return {
            sucesso: false,
            status: 500,
            Erro: error.message
        }
    }
}

export async function insert(banco, campos, valores){
    try{
        await db.query(`INSERT INTO ${banco} values(${campos})`, valores)
        return {
            sucesso: true,
            status: 200
        }
    }catch(error){
        return{
            sucesso: false,
            status: 500,
            Erro: error.message
        }
    }
}

export async function selectUnico(validacao, valor, banco){
    try{
        const [resposta] = await db.query(`SELECT * FROM ${banco} WHERE ${validacao}`, valor);
        return {
            sucesso: true,
            status: 200,
            resposta
        }
    }catch(error){
        return {
            sucesso: false,
            status: 500,
            Erro: error.message
        }
    }
}

export async function update(banco, campos, validacao, valores){
    try{
        await db.query(`UPDATE ${banco} SET ${campos} WHERE ${validacao}`, valores);
        return {
            sucesso: true,
            status: 200
        }
    }catch(error){
        return{
            sucesso: false,
            status: 500,
            Erro: error.message
        }
    }
}

export async function deletar(banco, validacao, valor){
    try{
        await db.query(`DELETE FROM ${banco} WHERE ${validacao}`, valor);
        return {
            sucesso: true,
            status: 200
        }
    }catch(error){
        return {
            sucesso: false,
            status: 500,
            Erro: error.message
        }
    }
}