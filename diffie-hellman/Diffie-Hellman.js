const crypto = require('crypto');

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