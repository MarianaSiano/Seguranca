const readline = require('readline');

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

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function descriptografarCesar(texto, k)
{
    let resultado = '';

    for(let i = 0; i < texto.length; i++) {
        let char = texto[i];

        if(char >= 'a' && char <= 'z') {
            let codigo = ((char.charCodeAt(0) - 97 - k + 26) % 26) + 97;
            resultado += String.fromCharCode(codigo);
        }

        else if(char > 'A' && char <= 'Z') {
            let codigo = ((char.charCodeAt(0) - 65 - k + 26) % 26) + 65;
            resultado += String.fromCharCode(codigo);
        }

        else
            resultado += char;
    }

    return resultado;
}

r1.question('Você quer (1) Criptografar ou (2) Descriptografar? ', function(operacao) {
    r1.question('Digite a mensagem => ', function(mensagem) {
        r1.question('Digite o valor da chave (1 a 25) => ', function(chaveStr) {
            const chave = parseInt(chaveStr);

            if(isNaN(chave) || chave < 1 || chave > 25) {
                console.log("Chave invalida. Uso um numero entre 1 e 25");
                r1.close();
                return;
            }

            if(operacao === '1') {
                const criptografada = cifraCesar(mensagem, chave);
                console.log('Mensagem criptografada => ', criptografada);
            }

            else if(operacao === '2') {
                const descripografada = descriptografarCesar(mensagem, chave);
                console.log("Mensagem descriptografada => ", descripografada);
            }

            else
                console.log('Opcao invalida. Digite 1 para criptografar ou 2 para descriptografar.');

            r1.close();
        });
    });
});