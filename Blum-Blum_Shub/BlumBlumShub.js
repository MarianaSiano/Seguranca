const { triggerAsyncId } = require('async_hooks');
const { read } = require('fs');

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

//Busca um segundo primo para formar n = p * q
function buscarOutroPrimo(p)
{
    let q = p + 2;
    while(true) {
        if(isPrimo(q) && q % 4 === 3)
            return q;

    q += 2;
    }
}

//Função principal para verificar o número
function verificaNumero()
{
    readline.question('\nDigite um numero maior que 10.000 para verificar (ou SAIR para encerrar) => ', input => {
        if(input.toLowerCase() === 'sair') {
            console.log('Encerrando o programa...');
            return readline.close();
        }
        const num = Number(input);

        if(isNaN(num)) {
            console.log('Por favor, digite um numero valido!');
            return verificaNumero();
        }

        if(num <= 10000) {
            console.log('O numero deve ser maior que 10.000');
            return verificaNumero();
        }

        const primo = isPrimo(num);
        const congruente = num % 4 === 3;

        console.log('\n===================================================');
        console.log(`Numero analisado => ${num}`);
        console.log(`Eh primo? ${primo ? 'Sim' : 'Nao'}`);
        console.log(`Eh maior que 10.000? ${num > 10000 ? 'Sim' : 'Nao'}`);
        console.log(`Eh congruente a 3 mod 4 (≡ 3 mod 4)? ${congruente ? 'Sim' : 'Nao'}`);

        if(primo && congruente) {
            console.log('\nEste numero PODE ser usado no Blum Blum Shub!');
            console.log('Atende a todos os requisitos:');
            console.log('- Primo');
            console.log('- Maior que 10.000');
            console.log('- Congruente a 3 mod 4');

            const p = num;
            const q = buscarOutroPrimo(p);
            console.log(`Primo complementar gerado => ${q}`);

            const bits = gerarBitsBBS(p, q, 64);
            console.log('\nBits gerados com BBS (64 bits) => ');
            console.log(bits);
        } else {
            console.log('\nEste numero NAO pode ser usado no Blum Blum Shub');
            if(!primo) {
                console.log('- Nao eh primo');
            }

            if(!congruente) {
                console.log('- Nao eh congruente a 3 mod 4');
            }
        }
        console.log('===================================================\n');
        verificaNumero(); //Chama recursivamente para nova verificação
    });
}

//Iniciar o programa
console.log('==================================================');
console.log('Verificador de primos para Blum Blum Shub');
console.log('==================================================');
console.log('Requisitos para o uso no BBS:');
console.log('- Deve ser numero primo');
console.log('- Deve ser maior que 10.000');
console.log('- Deve ser congruente a 3 mod 4');
console.log('Digite SAIR a qualquer momento para encerrar');

verificaNumero();