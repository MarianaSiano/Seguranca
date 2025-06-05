const crypto = require('crypto');

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