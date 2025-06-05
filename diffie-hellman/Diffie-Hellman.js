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