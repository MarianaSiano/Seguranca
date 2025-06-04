const fs = require('fs');

function gcd(a, b) 
{
    while (b !== 0) [a, b] = [b, a % b];
    return a;
}

//Exponenciação modular
function modPow(base, exponent, modulus) 
{
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

//Teste de primalidade
function isPrimo(num) 
{
    if(num < 2)
        return false;

    if(num === 2 || num === 3)
        return true;

    if(num % 2 === 0)
        return false;

    const sqrt = Math.floor(Math.sqrt(num));
    for(let i = 3; i <= sqrt; i += 2) {
        if(num % i === 0) return false;
    }
    return true;
}

//Gera um primo ≡ 3 mod 4
function gerarPrimo(min)
{
    let p = min | 1;
    while(!isPrimo(p) || p % 4 !== 3) p += 2;
    return p;
}

//Gera bits com BBS
function gerarBitsBBS(p, q, numBits = 100000)
{
    const n = p * q;

    //Gera seed aleatória segura
    let s;
    do {
        s = Math.floor(Math.random() * (n - 2)) + 2;
    } while (gcd(s, n) !== 1);

    console.log(`Semente s usada (secreta em casos reais) => ${s}`);
    console.log(`n (p * q) => ${n}`);

    let x = (s * s) % n;
    let bits = '';

    while(bits.length < numBits) {
        x = (x * x) % n;
        const bitsDeX = x.toString(2).padStart(32, '0');
        bits += bitsDeX;
    }

    return bits.slice(0, numBits);
}

//======================== EXECUÇÃO ============================
const p = gerarPrimo(100000);
const q = gerarPrimo(p + 1000);

console.log(`Primos usados:\np => ${p}\nq => ${q}`);
const bitstream = gerarBitsBBS(p, q, 100000); //100 mil bits

fs.writeFileSync('bits_bbs.txt', bitstream);
console.log('Arquivo bits_bbs.txt gerado com sucesso!');