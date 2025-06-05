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
function generateLargePrime(bits = 32)
{
    let candidato;
    do {
        candidato = crypto.randomInt(2 ** (bits - 1), 2 ** bits);
    } while(!isPrimo(candidato));
    return candidato;
}

//Protocolo Diffie-Hellman completo
function DiffieHellman()
{
    //Passo 1: Gerar ou receber um número primo grande p
    const p = generateLargePrime(2048);

    //Passo 2: Encontrar uma raiz primitiva g modulo p
    const g = findPrimitiveRoot(p);
    if(!g) {
        console.error('Nao foi possivel encontrar uma raiz primitiva para p => ', p);
        return;
    }
    console.log('Parametros publicos');
    console.log(`p (primo) => ${p}`);
    console.log(`g (raiz primitiva modulo p) ${g}`);

    //Passo 3: Pessoa X e Pessoa Y escolhem segredos privados
    const a = crypto.randomInt(2, p - 1); //Segredo da Pessoa X
    const b = crypto.randomInt(2, p - 1); //Segredo da Pessoa Y

    console.log('Segredos privados:');
    console.log(`a (da Pessoa X) => ${a}`);
    console.log(`b (da pessoa Y) => ${b}`);

    //Passo 4: Calcular valores públicos
    const A = modPow(g, a, p); //Pessoa X envia para a Pessoa Y
    const B = modPow(g, b, p); //Pessoa Y envia para a Pessoa X

    console.log('Valores trocados publicamente:');
    console.log(`A (Pessoa X -> Pessoa Y ) => ${A}`);
    console.log(`B (Pessoa Y -> Pessoa X) => ${B}`);

    //Passo 5: Calcular o segredo compartilhado
    const s_Pessoa_X = modPow(B, a, p); //Pessoa X calcula o segredo
    const s_Pessoa_Y = modPow(A, b, p); //Pessoa Y calcula o segredo

    console.log('Segredo compartilhado calculado:');
    console.log(`s (Pessoa X) => ${s_Pessoa_X}`);
    console.log(`s (Pessoa Y) => ${s_Pessoa_Y}`);

    //Verificação
    if(s_Pessoa_X === s_Pessoa_Y)
        console.log('Segredo compartilhado verificado com sucesso!');
    else {
        console.log('Erro no calculo do segredo compartilhado');
    }
}

//Executar o protocolo
DiffieHellman();