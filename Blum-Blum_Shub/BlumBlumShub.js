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
        if(exponent % 2 === 1)
            result = (result * base) % modulus;

        exponent = exponent >> 1;
        base = (base * base) % modulus;
    }
    return result;
}

//Teste de primalidade Miller-Robin robusto
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

    for(let i = 0; i < Math.min(k, bases.length); i++) {
        const a = bases[i];

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
        if(composite) return false;
    }
    return true;
}

//Função principal para verificar o número
function verificarNumero()
{
    readline.question('\nDigite um numero maior que 10.000 para verificar (ou sair para encerrar) => ', input => {
        if(input.toLowerCase() === 'sair') {
            console.log('Encerrando o programa...');
            return readline.close();
        }
        const num = Number(input);

        if(isNaN(num)) {
            console.log('Por favor, digite um numero valido!');
            return verificarNumero();
        }

        if(num <= 10000) {
            console.log('O numero deve ser maior que 10000');
            return verificarNumero();
        }
        const primo = isPrimo(num);
        const congruente = num % 4 === 3;

        console.log('\n===================================================');
        console.log(`Numero analisado => ${num}`);
        console.log(`Eh primo? ${primo ? 'Sim' : 'Nao'}`);
        console.log(`Eh maior que 10.000? ${num > 10000 ? 'Sim' : 'Nao'}`);
        console.log(`Eh congruente a 3 mod 4 (≡ 3 mod 4)? ${congruente ? 'Sim' : 'Nao'}`);

        if(primo && num > 10000 && congruente) {
            console.log('\nEste numero PODE ser usado no Blum Blum Shub!');
            console.log('Atende a todos os requisitos => ');
            console.log('- Primo');
            console.log('- > 10.000');
            console.log('- ≡ 3 mod 4');
        }
        else {
            console.log('\nEste numero NAO pode ser usado no Blum Blum Shub');
            if(!primo)
                console.log('- Nao eh primo');

            if(!congruente)
                console.log('- Nao eh congruente a 3 mod 4');
        }
        console.log('===================================================\n');

        verificarNumero(); //Chama recursivamente para nova verificação
    })
}