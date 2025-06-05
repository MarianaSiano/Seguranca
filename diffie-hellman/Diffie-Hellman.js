const crypto = require('crypto');

//Função de exponencialçao modular
function modPow(base, exp, mod)
{
    if(mod === 1)
        return 0;

    let result = 1;
    base = base % mod;

    while(exp > 0) {
        if(exp % 2 === 1)
            result = (result * base) % mod;

        exp = exp >> 1;
        base = (base * base) % mod;
    }
    return result;
}

//Função para verificar se um número é primo (Miller-Robin)
function isPrimo(num, k = 10)
{
    if(num <= 1)
        return false;

    if(num <= 3)
        return true;

    if(num % 2 === 0 || num % 3 === 0)
        return false;

    let d = n - 1;
    let s = 0;
    while(d % 2 === 0) {
        d /= 2;
        s++;
    }
    const bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    for(a  of bases) {
        if(a >= num)
            continue;

        let x = modPow(a, d, num);
        if(x === 1 || x === n - 1)
            continue;

        let composite = true;
        for(let j = 0; j < s - 1; j++) {
            x = modPow(x, 2, n);
            if(x === n - 1) {
                composite = false;
                break;
            }
        }
        if(composite)
            return false;
    }
    return true;
}

//Função para encontrar fatores primos únicos
function primeFactors(num)
{
    const factors = new Set();
    while(num % 2 === 0) {
        factors.add(2);
        num /= 2;
    }

    for(let i = 3; i <= Math.sqrt(num); i += 2) {
        while(num % i === 0) {
            factors.add(i);
            num /= i;
        }
    }
    if(n > 2)
        factors.add(num);

    return [...factors];
}