const crypto = require('crypto');

//Função auxiliar para obter fatores únicos de um número
function fatoresUnicos(num)
{
    const fatores = new Set();
    let divisor = 2;

    while(num >= 2) {
        if(num % divisor === 0) {
            fatores.add(divisor);
            num = num / divisor;
        } else {
            divisor++;
        }
    }
    return [...fatores];
}

//Função para encontrar uma raiz primitiva módulo p
function encontrarRaizPrimitiva(p)
{
    //Verifica se p é primo
    if(!isPrime(p)) {
        throw new Error('p deve ser um número primo');
    }
    const fatores = fatoresUnicos(p - 1);

    for(let g = 2; g < p; g++) {
        let raizPrimitiva = true;
        for(const f of fatores) {
            if(modPow(g, (p - 1) / f, p) === 1) {
                raizPrimitiva = false;
                break;
            }
        }
        if(raizPrimitiva) {
            return g;
        }
    }
    return null;
}