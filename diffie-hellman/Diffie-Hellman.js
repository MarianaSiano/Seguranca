const crypto = require('crypto');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

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

    let d = num - 1;
    let s = 0;
    while(d % 2 === 0) {
        d /= 2;
        s++;
    }
    const bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    for(const a  of bases) {
        if(a >= num)
            continue;

        let x = modPow(a, d, num);
        if(x === 1 || x === num - 1)
            continue;

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
    if(num > 2)
        factors.add(num);

    return [...factors];
}

//Função para encontrar uma raiz primitiva módulo p
function findPrimitiveRoot(p)
{
    if(!isPrimo(p))
        return null;

    const phi = p - 1;
    const factors = primeFactors(phi);

    for(let g = 2; g <= p; g++) {
        let isRoot = true;
        for(const f of factors) {
            if(modPow(g, phi / f, p) === 1) {
                isRoot = false;
                break;
            }
        }
        if(isRoot)
            return g;
    }
    return null;
}

//Função para gerar um número primo grande
function generateLargePrime(min, max)
{
    let candidato;
    do {
        candidato = crypto.randomInt(min, max);
    } while(!isPrimo(candidato));
    return candidato;
}

//Protocolo Diffie-Hellman completo
async function DiffieHellman()
{
    console.log('========================================================');
    console.log('PROTOCOLO DIFFIE-HELLMAN');
    console.log('========================================================');

    //Obter o valor minimo do usuario (garantindo que seja maior ou igual a 10.000)
    let minimo;
    do {
        const input = await questionAsync('Digite o valor MÍNIMO para números primos (deve ser maior ou igual a 10000) => ');
        minimo = parseInt(input);
        
        if(isNaN(minimo)) {
            console.log('Por favor, digite um número válido!');
        } else if (minimo < 10000) {
            console.log('O valor mínimo deve ser pelo menos 10000!');
        }
    } while(isNaN(minimo) || minimo < 10000);

    //Obter o valor maximo do usuario (deve ser maior que o minimo)
    let maximo;
    do {
        const input = await questionAsync(`Digite o valor MÁXIMO para números primos (deve ser maior que ${minimo}) => `);
        maximo = parseInt(input);
        
        if(isNaN(maximo)) {
            console.log('Por favor, digite um número válido!');
        } else if(maximo <= minimo) {
            console.log(`O valor máximo deve ser maior que ${minimo}!`);
        }
    } while(isNaN(maximo) || maximo <= minimo);
    console.log('\nGerando numeros primos... Isso pode levar alguns segundos...\n');

    //Passo 1: Gerar número primo grande
    const p = generateLargePrime(minimo, maximo);

    //Passo 2: Encontrar raiz primitiva g modulo p
    const g = findPrimitiveRoot(p);
    if(!g) {
        console.error('Nao foi possivel encontrar uma raiz primitiva para p => ', p);
        readline.close();
        return;
    }

    console.log('==================================');
    console.log('PARAMETROS PUBLICOS');
    console.log('==================================');
    console.log(`p (numero primo) => ${p}`);
    console.log(`g (raiz primitiva modulo p) => ${g}`);

    //Passo 3: Gerar segredos privados
    const a = crypto.randomInt(2, p - 1); //Segredo da Pessoa X
    const b = crypto.randomInt(2, p - 1); //Segredo da Pessoa Y

    console.log('\n══════════════════════════════════════');
    console.log('SEGREDOS PRIVADOS:');
    console.log('══════════════════════════════════════');
    console.log(`a (Pessoa X) => ${a}`);
    console.log(`b (Pessoa Y) => ${b}`);

    //Passo 4: Calcular valores públicos
    const A = modPow(g, a, p); //Pessoa X -> Pessoa Y
    const B = modPow(g, b, p); //Pessoa Y -> Pessoa X

    console.log('\n══════════════════════════════════════');
    console.log('VALORES TROCADOS PUBLICAMENTE:');
    console.log('══════════════════════════════════════');
    console.log(`A = g ^ a mod p => ${A}`);
    console.log(`B = g ^ b mod p => ${B}`);

    //Passo 5: Calcular segredo compartilhado
    const sX = modPow(B, a, p); //Pessoa X calcula o segredo
    const sY = modPow(A, b, p); //Pessoa Y calcula o segredo

    console.log('\n══════════════════════════════════════');
    console.log('SEGREDO COMPARTILHADO:');
    console.log('══════════════════════════════════════');
    console.log(`Segredo calculado por X => ${sX}`);
    console.log(`Segredo calculado por Y => ${sY}`);

    //Verificação
    if(sX === sY) {
        console.log('\nSegredo compartilhado identico!');
    } else {
        console.log('\nErro: Os segredos não coincidem!');
    }

    readline.close();
}

//Função auxiliar para usar await com readline.question
function questionAsync(prompt) 
{
    return new Promise(resolve => {
        readline.question(prompt, resolve);
    });
}

//Executar o protocolo
DiffieHellman();