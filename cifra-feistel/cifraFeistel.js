const { parse } = require('path');
const readline = require('readline');

class CifraFeistel
{
    constructor(rounds = 16) {
        this.rounds = rounds;
    }

    //Função F com BigInt
    f(key, block) {
        const bigChave = BigInt(key);
        let val = block ^ bigChave;
        val = ((val << 3n) | (val >> 29n)) & 0xFFFFFFFFn;
        val = val ^ 0xAAAAAAAAn;
        return val;
    }

    splitBlock(block) {
        const left = (block >> 32n) & 0xFFFFFFFFn;
        const right = block & 0xFFFFFFFFn;
        return [left, right];
    }

    joinBlocks(left, right) {
        return ((left << 32n) | right) & 0xFFFFFFFFFFFFFFFFn;
    }

    generateSubChaves(key) {
        const subChaves = [];
        let current = key;
        for(let i = 0; i < this.rounds; i++) {
            subChaves.push(current ^ i);
            current = ((current << 1) | (current >>> 31)) & 0xFFFFFFFF;
        }
        return subChaves;
    }

    encryptBlocks(block, key) {
        let [left, right] = this.splitBlock(block);
        const subChaves = this.generateSubChaves(key);

        for(let i = 0; i < this.rounds; i++) {
            const temp = right;
            right = left ^ this.f(subChaves[i], right);
            left = temp;
        }

        [left, right] = [right, left];
        return this.joinBlocks(left, right);
    }

    decryptBlock(block, key) {
        let [left, right] = this.splitBlock(block);
        const subChaves = this.generateSubChaves(key);

        for(let i = this.rounds - 1; i >= 0; i--) {
            const temp = left;
            left = right ^ this.f(subChaves[i], left);
            right = temp;
        }

        [left, right] = [right, left];
        return this.joinBlocks(left, right);
    }

    encryptString(text, key) {
        const buffer = Buffer.from(text, 'utf8');
        let block = 0n;

        for(let i = 0; i < 8 && i < buffer.length; i++)
            block = (block << 8n) | BigInt(buffer[i]);

        const encrypted = this.encryptBlocks(block, key);
        return encrypted.toString(16).padStart(16, '0');
    }

    decryptString(hex, key) {
        const block = BigInt('0x' + hex);
        const decrypted = this.decryptBlock(block, key);
        const bytes = [];
        let temp = decrypted;

        for(let i = 0; i < 8; i++) {
            bytes.unshift(Number(temp & 0xFFn));
            temp = temp >> 8n;
        }
        return Buffer.from(bytes).toString('utf8').replace(/\x00/g, '');
    }
}

//Interface com o usuario
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cifra = new CifraFeistel(16);

//Função para ler chaves
function parseKey(input) {
    //Remove espacos acidentais
    input = input.trim();

    //Tenta interpretar como decimal
    if(/^\d+$/.test(input)) {
        const num = parseInt(input, 10);
        if(num >= 0 && num <= 0xFFFFFFFF)
            return num;
        throw new Error('A chave deve estar entre 0 e 4294967295');
    }

    //Tenta interpretar como hexadecimal (com ou sem 0x)
    if(/^(0x)?[0-9A-Fa-f]+$/.test(input)) {
        const hexValue = input.startsWith('0x') ? input.slice(2) : input;
        if (hexValue.length > 8) throw new Error('Chave hex muito longa (máx 8 caracteres)');
        return parseInt(hexValue, 16);
    }
    throw new Error('Digite um numero decimal ou hexadecimal!');
}

function menu() {
    console.log('\n=========== Cifra de Feistel ==============');
    console.log('1. Encriptar bloco hexadecimal');
    console.log('2. Decriptar bloco hexadecimal');
    console.log('3. Encriptar texto');
    console.log('4. Decriptar texto');
    console.log('5. Sair');

    r1.question('Escolha uma opcao (1-5) => ', (choice) => {
        switch(choice) {
            case '1':
                r1.question('Digite o bloco hexadecimal (16 caracteres) => ', (block) => {
                    r1.question('Digite a chave (8 caracteres hex) => ', (key) => {
                        const blockBigInt = BigInt('0x' + block);
                        const chaveInt = parseInt(key, 16);
                        const encrypted = cifra.encryptBlocks(blockBigInt, chaveInt);
                        console.log('Resultado => ', encrypted.toString(16).padStart(16, '0'));
                        menu();
                    });
                });
            break;

            case '2':
                r1.question('Digite o bloco encriptado (16 caracteres hex) => ', (block) => {
                    r1.question('Digite a chave (8 caracteres hex) => ', (key) => {
                        const blockBigInt = BigInt('0x' + 16);
                        const chaveInt = parseInt(key, 16);
                        const decrypted = cifra.decryptBlock(blockBigInt, chaveInt);
                        console.log('Resultado => ', decrypted.toString(16), padStart(16, '0'));
                        menu();
                    });
                });
            break;

            case '3':
                r1.question('Digite o texto a encriptar => ', (text) => {
                    r1.question('Digite a chave (ex.: DEADBEEF) => ', (key) => {
                        try {
                            const chaveInt = parseKey(key);
                            const encrypted = cifra.encryptString(text, chaveInt);
                            console.log('Resultado => ', encrypted);
                        } catch(erro) {
                            console.log('Erro => ', erro.message);
                        }
                        menu();
                    });
                });
            break;

            case '4':
                r1.question('Digite o texto encriptado (hex) => ', (text) => {
                    r1.question('Digite a chave (ex.: DEADBEEF) => ', (key) => {
                        try {
                            const chaveInt = parseKey(key);
                            const decrypted = cifra.decryptString(text, chaveInt);
                            console.log('Resultado => ', decrypted);
                        } catch(erro) {
                            console.log('Erro => ', erro.message);
                        }
                        menu();
                    });
                });
            break;

            case '5':
                r1.close();
            break;
            
            default:
                console.log('Opção invalida!');
                menu();
        }
    });
}

//Inicia o programa
console.log('Bem vindo(a) ao sistema do Cifra de Feistel!');
console.log('A chave pode ser inserida em hexadecimal (ex.: DEADBEEF, 0xDEADBEEF, deadbeef, 5d8f9db3)');
menu();