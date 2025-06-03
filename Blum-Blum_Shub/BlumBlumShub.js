const fs = require('fs');

//Função para verificar se dois números são co-primos
function isCoprimo(a, b)
{
    return gcd(a, b) === 1;
}

//Algoritmo de Euclides para MDC
function gcd(a, b)
{
    while(b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

//Teste de primalidade Miller-Rabin (implementação simplificada)
function isPrimo(num, k = 5)
{
    if(num <= 1)
        return false;

    if(num <= 3)
        return true;

    if(num % 2 === 0 || num % 3 === 0)
        return false;

    //Escrever num - 1 como d * 2 ^ s
    let d = num - 1;
    let s = 0;

    while(d % 2 === 0) {
        d /= 2;
        s++;
    }

    //Testar k vezes
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

//Exponenciação Modular (para múltiplos grandes)
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

//Classe Blum Blum Shub
class BlumBlumShub
{
    constructor(p, q, seed) {
        //Verificar se p e q são primos ≡ 3 mod 4
        if(!isPrime(p) || p % 4 !== 3) 
            throw new Error('p deve ser primo ≡ 3 mod 4');

        if(!isPrime(q) || q % 4 !== 3)
            throw new Error('q deve ser primo ≡ 3 mod 4');

        if(!isCoprime(seed, p * q))
            throw new Error('A semente deve ser coprima com n = p*q');

        this.n = p * q;
        this.state = seed % this.n;
    }

    //Gerar próximo bit
    nextBit() {
        this.state = modPow(this.state, 2, this.n);
        return this.state % 2;
    }

    //Gerar sequência de bits
    generateBits(length) {
        const bits = [];

        for(let i = 0; i < length; i++)
            bits.push(this.nextBit());

        return bits;
    }
}

//Parâmetros do algoritmo (primos > 1000 ≡ 3 mod 4)
const p = 10007; //Primo ≡ 3 mod 4
const q = 10039; //Primo ≡ 3 mod 4
const seed = 101; //Somente co-prima com n

//Verificação dos parâmetros
console.log(`p é primo e ≡ 3 mod 4? ${isPrime(p) && p % 4 === 3}`);
console.log(`q é primo e ≡ 3 mod 4? ${isPrime(q) && q % 4 === 3}`);
console.log(`semente é co-primo com n? ${isCoprimo(seed, p * q)}`);

//Criar gerador BBS
const bbs = new BlumBlumShub(p, q, seed);

//Gerar 1.000.000 de bits para teste NIST
const bits = bbs.generateBits(1000000);

//Salvar em arquivo para testes NIST
const bitString = bits.join('');
fs.writeFileSync('bbs_bits.txt', bitString);

console.log('Sequência de 1.000.000 bits gerada e salva em bbs_bits.txt');