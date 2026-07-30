import db from "../config/db.js";

export async function select(banco){
    try{
        const [response] = await db.query(`SELECT * FROM ${banco}`);
        return {
            sucesso: true,
            response 
        }
    }catch(error){
        return {
            sucesso: false,
            Erro: error.message
        }
    }
}

export async function insert(banco, campos, valores){
    try{
        console.log(`INSERT INTO ${banco} values(${campos})`, valores);
        await db.query(`INSERT INTO ${banco} values(${campos})`, valores)
        return {
            sucesso: true
        }
    }catch(error){
        return{
            sucesso: false,
            Erro: error.message
        }
    }
}

export async function selectUnico(campo, valor, banco){
    try{
        const [resposta] = await db.query(`SELECT * FROM ${banco} WHERE ${campo}`, valor);
        return {
            sucesso: true,
            resposta
        }
    }catch(error){
        return {
            sucesso: false,
            Erro: error.message
        }
    }
}

export async function update(banco, campos, validacao, valores){
    try{
        await db.query(`UPDATE ${banco} SET ${campos} WHERE ${validacao}`, valores);
        return {
            sucesso: true
        }
    }catch(error){
        return{
            sucesso: false,
            Erro: error.message
        }
    }
}

export async function deletar(banco, validacao, valor){
    try{
        await db.query(`DELETE FROM ${banco} WHERE ${validacao}`, valor);
        return {
            sucesso: true
        }
    }catch(error){
        return {
            sucesso: false,
            Erro: error.message
        }
    }
}