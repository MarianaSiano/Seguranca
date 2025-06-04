const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function gcd(a, b)
{
    while (b !== 0) 
        [a, b] = [b, a % b];

    return a;
}

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
        if(num % i === 0)
            return false;
    }
    return true;
}

function gerarPrimoApartir(min) 
{
    let p = min | 1; //Garante que começa com número ímpar
    while(!isPrimo(p) || p % 4 !== 3)
        p += 2;

    return p;
}

function gerarBitsBBS(p, q, numBits = 100000) 
{
    const n = p * q;
    let s;
    do {
        s = Math.floor(Math.random() * (n - 2)) + 2;
    } while(gcd(s, n) !== 1);

    console.log(`\nSemente s usada (secreta em aplicações reais) => ${s}`);
    console.log(`n = p * q = ${n}`);

    let x = (s * s) % n;
    let bits = '';

    while(bits.length < numBits) {
        x = (x * x) % n;
        const bitsDeX = x.toString(2).padStart(32, '0');
        bits += bitsDeX;
    }

    return bits.slice(0, numBits);
}

function solicitarP()
{
    readline.question('Digite o valor de p (primo, maior que 10000, congruente 3 mod 4) => ', pStr => {
        const p = Number(pStr);
        if(!isPrimo(p) || p <= 10000 || p % 4 !== 3) {
            console.log('p inválido. Deve ser primo, maior que 10000 e congruente 3 mod 4.\n');
            return solicitarP();
        }

        const q = gerarPrimoApartir(p + 1000);
        console.log(`\nPrimos usados:\np => ${p}\nq => ${q}`);

        const bits = gerarBitsBBS(p, q, 100000);
        fs.writeFileSync('bits_bbs.txt', bits);
        console.log('\nArquivo "bits_bbs.txt" gerado com 100.000 bits.');
        readline.close();
    });
}

console.log('================================================= GERADOR BBS COM p DIGITADO E q GERADO AUTOMATICAMENTE =================================================');
console.log('Requisitos para p:');
console.log('- Deve ser primo');
console.log('- Deve ser maior que 10.000');
console.log('- Deve ser congruente 3 mod 4');
solicitarP();