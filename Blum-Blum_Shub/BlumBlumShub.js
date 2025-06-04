const fs = require('fs');

//Função para calcular o máximo divisor comum (GCD)
function gcd(a, b) 
{
    while(b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

//Função para verificar se dois números são coprimos
function isCoprimo(a, b)
{
    return gcd(a, b) === 1;
}

//Função de exponenciação modular eficiente
function modPow(base, exponent, modulus) 
{
    if(modulus === 1) 
        return 0;

    let result = 1;
    base = base % modulus;

    while(exponent > 0) {
        if(exponent % 2 === 1)
            result = (result * base) % modulus;

        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    return result;
}

//Teste de primalidade Miller-Rabin simplificado
function isPrimo(num, k = 5) 
{
    if(num <= 1)
        return false;

    if(num <= 3)
        return true;

    if(num % 2 === 0 || num % 3 === 0)
        return false;

    //Escrever num - 1 como d * 2^s
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

//Classe Blum Blum Shup
class BlumBlumShub 
{
    constructor(p, q, seed) {
        //Verificar se p e q são primos ≡ 3 mod 4
        if(!isPrimo(p) || p % 4 !== 3)
            throw new Error('p deve ser primo ≡ 3 mod 4');
        if(!isPrimo(q) || q % 4 !== 3)
            throw new Error('q deve ser primo ≡ 3 mod 4');

        if(!isCoprimo(seed, p * q))
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
        for (let i = 0; i < length; i++) {
            bits.push(this.nextBit());
        }
        return bits;
    }
}

//Parâmetros do algoritmo
const p = 10007;  //Primo ≡ 3 mod 4
const q = 10039;  //Primo ≡ 3 mod 4
const seed = 101;  //Semente coprima com n

//Verificação dos parâmetros
console.log(`p eh primo e ≡ 3 mod 4? ${isPrimo(p) && p % 4 === 3}`);
console.log(`q eh primo e ≡ 3 mod 4? ${isPrimo(q) && q % 4 === 3}`);
console.log(`semente eh coprima com n? ${isCoprimo(seed, p * q)}`);

//Criar gerador BBS
const bbs = new BlumBlumShub(p, q, seed);

//Gerar 10.000 de bits para teste NIST
console.log('Gerando 10.000 bits... Isso pode levar alguns segundos...');
const bits = bbs.generateBits(10000);

//Converter para string (para salvar em arquivo se necessário)
const bitString = bits.join('');

//Mostrar os primeiros 10.000 bits como exemplo
console.log('Primeiros 10.000 bits => ', bitString.substring(0, 10000));

fs.writeFileSync('bbs_bits.txt', bitString);
console.log('Sequência de bits salva em bbs_bits.txt');