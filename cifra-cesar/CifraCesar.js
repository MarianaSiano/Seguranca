const readline = require('readline');

//Atividade 1
function CifraCesar(texto, k) {
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

function descriptografarCesar(texto, k)
{
    let resultado = "";

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

//Atividade 2
function contarFrequencia(texto)
{
    const freq = {};

    for(let char of texto.toUpperCase()) {
        if(char >= 'A' && char <= 'Z') {
            freq[char] = (freq[char] || 0) + 1;
        }
    }

    return freq;
}

function encontrarLetraMaisFrequente(freq)
{
    let max;
    let letraMaisFrequente = '';
    max = 0;

    for(let letra in freq) {
        if(freq[letra] > max) {
            max = freq[letra];
            letraMaisFrequente = letra;
        }
    }

    return letraMaisFrequente;
}

function criptonaliseCesar(texto)
{
    const freq = contarFrequencia(texto);
    const letraMaisFrequente = encontrarLetraMaisFrequente(freq);

    //Presumindo que a letra mais frequente na cifra representa o 'A'
    const deslocamento = (letraMaisFrequente.charCodeAt(0) - 'A'.charCodeAt(0) + 26) % 26;
    const textoDecifrado = descriptografarCesar(texto, deslocamento);

    return {
        letraMaisFrequente,
        deslocamento,
        textoDecifrado
    };
}

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

r1.question('Voce que: \n (1) Criptografia \n (2) Descriptografar \n (3) Criptoanalise por Frequencia. \n Escolha => ', function(operacao) {
    if(operacao === '1' || operacao === '2') {
        //Atividade 1: Criptografar ou Descriptografar com Chave
        r1.question('Digite a mensagem => ', function(mensagem) {
            r1.question('Digite o valor da chave (1 a 25) => ', function(chaveStr) {
                const chave = parseInt(chaveStr);

                if(isNaN(chave) || chave < 1 || chave > 25) {
                    console.log("Chave invalida. Use um numero entre 1 e 25");
                    r1.close();
                    return;
                }

                if(operacao === '1') {
                    const criptografada = CifraCesar(mensagem, chave);
                    console.log('\n Mensagem criptografada => ', criptografada);
                }

                else {
                    const descriptografada = descriptografarCesar(mensagem, chave);
                    console.log('\n Mensagem descriptografada => ', descriptografada);
                }

                r1.close();
            });
        });
    }

    else if(operacao === '3') {
        //Atividade 2: Criptoanálise por Frequência de Letras
        r1.question('Digite a mensagem criptografada => ', function(mensagemCriptografada) {
            const resultado = criptonaliseCesar(mensagemCriptografada);

            console.log('\n Letra mais frequente na mensagem: ', resultado.letraMaisFrequente);
            console.log('\n Descolamento estimado (chave): ', resultado.deslocamento);
            console.log('\n Mensagem decriptografada (estimada): ', resultado.textoDecifrado);

            r1.close();
        });
    }

    else {
        console.log('Opcao invalida. Escolha 1, 2 ou 3.');
        r1.close();
    }
});