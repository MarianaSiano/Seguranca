const fs = require('fs');
const { blob } = require('stream/consumers');
const { RetryAgent } = require('undici-types');
const { threadId } = require('worker_threads');

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

//Classe Blum Blum Shup
class BlumBlumShup
{
    constructor(p, q, seed) {
        if(!isPrimo(p) || p % 4 !== 3)
            throw new Error('p deve ser primo ≡ 3 mod 4');

        if(!isPrimo(q) || q % 4 !== 3)
            throw new Error('q deve ser primo ≡ 3 mod 4');

        if(!isCoprimo(seed, p * q))
            throw new Error('A semente deve ser co-primo com n = p * q');

        this.n = p * q;
        this.state = seed % this.n;
    }

    nextBit() {
        this.state = modPow(this.state, 2, this.n);
        return this.state % 2;
    }

    generateBits(length) {
        const bits = [];

        for(let i = 0; i < length; i++)
            bits.push(this.nextBit());

        return bits;
    }
}

//Parâmetros do algoritmo
const p = 10007;
const q = 10039;
const seed = 101;

//Verificação dos parâmetros
console.log(`p eh primo e ≡ 3 mod 4? ${isPrimo(p) && p % 4 === 3}`);
console.log(`q eh primo e ≡ 3 mod 4? ${isPrimo(q) && q % 4 === 3}`);
console.log(`Semente eh co-primo com n? ${isCoprimo(seed, p * q)}`);

//Criar gerador BBS
const bbs = new BlumBlumShup(p, q, seed);

//Gerar 1.000.000 de bits para teste NIST
const bits = bbs.generateBits(1000000);

//Salvar em arquivo para testes NIST
const bitString = bits.join('');
fs.writeFileSync('bbs_bits.txt', bitString);

console.log('Sequencia de 1.000.000 bits gerada e salva em bbs_bits.txt');