const { triggerAsyncId } = require('async_hooks');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

//Função para calcular GCD (Máximo Divisor Comum)
function gcd(a, b)
{
    while(b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

//Função de exponenciação modular eficiente
function modPow(base, exponent, modulus)
{
    if(modulus === 1)
        return 0;

    let result = 1;
    base = base % modulus;

    while(exponent > 0) {
        if(exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
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

    if(num % 2 === 0 && num % 3 === 0)
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
            continue

        let composite = true;

        for(let j = 0; j < s - 1; j++) {
            x = modPow(x, 2, num);
            if(x === num - 1) {
                composite = false;
                break;
            }
        }
        if(composite)
            return false;
    }
    return true;
}

//Função para gerar bits com Blum Blum Shub
function gerarBitsBBS(p, q, quantidadeBits = 64)
{
    const n = p * q;

    //s deve ser co-primo de n
    let s = 3;
    while(gcd(s, n) !== 1) {
        s++;
    }
    let x = (s * s) % n;
    let bits = '';

    for(let i = 0; i < quantidadeBits; i++) {
        x = (x * x) % n;
        bits += (x % 2).toString();
    }
    return bits;
}