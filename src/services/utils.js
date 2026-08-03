export function formatarTelefone(telefone){
    const telefoneString = telefone + "";
    const numeros = telefoneString.replace(/\D/g, "");
    let numeroFormatado
    if(numeros.length == 11){
        numeroFormatado = numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1)$2-$3");
    }else if(numeros.length == 10){
        numeroFormatado = numeros.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1)$2-$3");
    }else{
        return "";
    }

    return numeroFormatado;
}
