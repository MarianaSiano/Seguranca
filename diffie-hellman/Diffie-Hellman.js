const crypto = require('crypto');

//Função auxiliar para obter fatores únicos de um número
function fatoresUnicos(num)
{
    const fatores = new Set();
    let divisor = 2;

    while(num >= 2) {
        if(num % divisor === 0) {
            fatores.add(divisor);
            num = num / divisor;
        } else {
            divisor++;
        }
    }
    return [...fatores];
}

//Função de exponenciação modular
function modPow(base, exponent, modulus)
{
    if(modulus === 1)
        return 0;

    let result = 1;
    base = base % modulus;

    while(exponent > 0) {
        if(exponent % 2 === 1)
            result = (result * base) % modulus;

        exponent = exponent >> 1;
        base = (base * base) % modulus;
    }
    return result;
}

//Teste de primalidade Miller-Rabin
function isPrimo(num, k = 10)
{
    if(num <= 1)
        return false;

    if(num <= 3)
        return true;

    if(num % 2 === 0 || num % 3 === 0)
        return false;

    let d = num - 1;
    let s = 0;

    while(d % 2 === 0) {
        d /= 2;
        s++;
    }

    const bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    for(let i = 0; i < Math.min(k, bases.length); i++) {
        const a = bases[i];
        if(a >= num)
            continue;

        let x = modPow(a, d, num);
        if(x === 1 || x === num - 1)
            continue;

        let compisite = true;
        for(let j = 0; j < s - 1; j++) {
            x = modPow(x, 2, num);
            if(x === num - 1) {
                compisite = false;
                break;
            }
        }
        if(compisite)
            return false;
    }
    return true;
}

//Função para encontrar uma raiz primitiva módulo p
function encontrarRaizPrimitiva(p)
{
    //Verifica se p é primo
    if(!isPrimo(p)) {
        throw new Error('p deve ser um número primo');
    }
    const fatores = fatoresUnicos(p - 1);

    for(let g = 2; g < p; g++) {
        let raizPrimitiva = true;
        for(const f of fatores) {
            if(modPow(g, (p - 1) / f, p) === 1) {
                raizPrimitiva = false;
                break;
            }
        }
        if(raizPrimitiva) {
            return g;
        }
    }
    return null;
}

//Implementação do Diffie-Hellman
function DiffieHellman()
{
    const p = 23;
    const g = 5;
    console.log("Parametros publicos:");
    console.log(`p (primo) => ${p}`);
    console.log(`g (raiz primitiva) => ${g}`);

    //Pessoa X escolhe um segredo privado a
    const a = crypto.randomInt(2, p - 1);

    //Pessoa Y escolhe um segredo privado b
    const b = crypto.randomInt(2, p - 1);
    console.log("Segredos privados:");
    console.log(`a (pessoa X) => ${a}`);
    console.log(`b (pessoa Y) => ${b}`)

    //Pessoa X calcula A = g ^ a mod p
    const A = modPow(g, a, p);

    //Pessoa Y calcula B = g ^ b mod p
    const B = modPow(g, b, p);
    console.log("Valores calculados e trocados:");
    console.log(`A (de pessoa X para pessoa Y) => ${A}`);
    console.log(`B (de pessoa Y para pessoa X) => ${B}`);

    //Pessoa X calcula o segredo compartilhado s = B ^ a mod p
    const sPessoa_X = modPow(B, a, p);

    //Pessoa Y calcula o segredo compartilhado s = A ^ b mod p
    const sPessoa_Y = modPow(A, B, p);
    console.log("Segredo compartilhado:");
    console.log(`s calculado pela pessoa X => ${sPessoa_X}`);
    console.log(`s calculado pela pessoa Y => ${sPessoa_Y}`);

    //Verificação
    if(sPessoa_X === sPessoa_Y) {
        console.log("O segredo compartilhado foi calculado corretamente por ambas as partes!");
    } else {
        console.log("Erro no calculo do segredo compartilhado");
    }
}

//Executar o protocolo
DiffieHellman();