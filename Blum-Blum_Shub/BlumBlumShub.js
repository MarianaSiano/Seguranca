const fs = require('fs');
const { RetryAgent } = require('undici-types');

//Funções auxiliares
function gcd(a, b)
{
    while(b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function isCoprimo(a, b)
{
    return gcd(a, b) === 1;
}

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

function isPrimo(num, k = 5)
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

    for(let i = 0; i < k; i++) {
        const a = 2 + Math.floor(Math.random() * (num - 4));
        let x = modPow(a, d, num);

        if(x === 1 || x === num - 1)
            continue;

        let continueLoop = false;

        for(let j = 0; j < s - 1; j++) {
            x = modPow(x, 2, num);

            if(x === num - 1) {
                continueLoop = true;
                break;
            }
        }
        if(continueLoop)
            continue;

        return false;
    }
    return true;
}