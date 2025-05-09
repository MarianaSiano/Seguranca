function cifraCesar(texto, k) {
    //Garante que o deslocamento esteja entre 1 e 25
    if (k < 1 || k > 25)
        throw new Error("O deslocamento (k) deve estar entre 1 e 25");

    let resultado = '';

    for (let i = 0; i < texto.length; i++) {
        let char = texto[i];

        if(char >= 'a' && char <= 'z') {
            //Encripta letra minuscula
            let codigo = ((char.charCodeAt(0) - 97 + k) % 26) + 97;
            resultado += String.fromCharCode(codigo);
        }

        else if(char >= 'A' && char <= 'Z') {
            //Encripta letra maiúscula
            let codigo = ((char.charCodeAt(0) - 65 + k) % 26) + 65;
            resultado += String.fromCharCode(codigo);
        }

        else //Mantem outros caracteres (espacos, pontuacao, etc)
            resultado += char;
    }
    return resultado;
}

let mensagem = 'Seguranca da Informacao';
let chave = 3;

console.log(cifraCesar(mensagem, chave));