const { parse } = require('path');
const readline = require('readline');
const { threadId } = require('worker_threads');

class CifraFeistel {
    constructor(rounds = 16) {
        this.rounds = rounds;
    }

    //Função F com BigInt
    f(key, block) {
        const bigChave = BigInt(key);
        let val = block ^ bigChave;
        val = ((val << 3n) | (val >> 5n)) & 0xFFFFFFFFn;
        val = val ^ 0xAAAAAAAAn;
        return val;
    }

    splitBlock(block) {
        const left = (block >> 32n) & 0xFFFFFFFFn;
        const right = block & 0xFFFFFFFFn;
        return [left, right];
    }

    joinBlocks(left, right) {
        return (left << 32n) | right
    }

    generateSubChaves(key) {
        const subChaves = [];
        let current = key;
        for(let i = 0; i < this.rounds; i++) {
            subChaves.push(current);
            current = ((current << 1) | (current >>> 31)) & 0xFFFFFFFF;
        }
        return subChaves;
    }

    encryptBlock(block, key) {
        let [left, right] = this.splitBlock(block);
        const subChaves = this.generateSubChaves(key);

        for(let i = 0; i < this.rounds; i++) {
            const temp = right;
            right = left ^ this.f(subChaves[i], right);
            left = temp;
        }
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
        return this.joinBlocks(left, right);
    }

    encryptString(text, key) {
        const buffer = Buffer.from(text, 'utf8');
        let block = 0n;

        for(let i = 0; i < Math.min(8, buffer.length); i++)
            block = (block << 8n) | BigInt(buffer[i]);

        //Padding para garantir 8 bytes
        while((block >> 64n) !== 0n)
            block >>= 8n;

        const encrypted = this.encryptBlock(block, key);
        return encrypted.toString(16).padStart(16, '0').toUpperCase();
    }

    decryptString(hex, key) {
        try {
            const block = safeHexToBigInt(hex);
            const decrypted = this.decryptBlock(block, key);
            const bytes = [];
            let temp = decrypted;

            for(let i = 0; i < 8; i++) {
                bytes.unshift(Number(temp & 0xFFn));
                temp >>= 8n;
            }

            while(bytes.length > 1 && bytes[0] == 0)
                bytes.shift();

            return Buffer.from(bytes).toString('utf8')
        } catch(erro) {
            return `[Falha na decriptação => ${erro.message}]`;
        }
    }
}

//Interface com o usuario
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cifra = new CifraFeistel(16);

//Funcao para converter hexadecimal
function safeHexToBigInt(hex) {
    if(!hex || typeof hex !== 'string')
        throw new Error('Valor hexadecimal não pode estar vazio');

    //Remove espaços e prefixo 0x se existir
    const cleanHex = hex.trim().replace(/^0x/i, '');

    //Verifica se é hexadecimal válido
    if(!/^[0-9A-F]+$/i.test(cleanHex))
        throw new Error(`"${hex}" nao é um hexadecimal valido`);

    try {
        return BigInt('0x' + cleanHex);
    } catch(erro) {
        throw new Error(`Falha ao converter "${hex}" para BigInt`);
    }
}

//Função para ler chaves
function parseKey(input) {
    //Verifica se o input é válido
    if(!input || typeof input !== 'string')
        throw new Error('Chave não pode estar vazia');

    const chaveOriginal = input.trim();
    const strInput = chaveOriginal.toUpperCase();

    if(/^(0x)?[0-9A-F]+$/i.test(strInput)) {
        const hexValue = strInput.replace(/^0x/, '');
        if(hexValue.length > 8)
            throw new Error('Chave hex deve ter no maximo 8 caracteres');
        try {
            const num = parseInt(hexValue, 16);
            if(isNaN(num)) throw new Error('Valor hexadecimal invalido');
            return { numeric: num, original: chaveOriginal };
        } catch(erro) {
            throw new Error(`Falha ao processar chave hexadecimal => ${erro.message}`);
        }
    }

    if(/^\d+$/.test(strInput)) {
        const num = parseInt(strInput, 10);

        if(isNaN(num)) throw new Error('Valor decimal invalido');
        if(num > 0xFFFFFFFF)
            throw new Error('Chave deve ser menor que 4294967295');
        return { numeric: num, original: chaveOriginal };
    }
    throw new Error(`Formato invalido => "${chaveOriginal}"`)
}

function menu() {
    console.log('\n=========== Cifra de Feistel ==============');
    console.log('1. Encriptar texto');
    console.log('2. Decriptar texto');
    console.log('3. Sair');
    console.log('\nDica: Chave pode ser decimal (123456) ou hex (DEADBEEF)');

    r1.question('Escolha uma opção (1-3) => ', (choice) => {
        switch(choice) {
            case '1':
                r1.question('Texto para encriptar => ', (text) => {
                    r1.question('Digite a chave => ', (key) => {
                        try {
                            //Armazena a chave original antes de qualquer processamento
                            const chaveOriginal = key.trim();
                            const { numeric: chaveInt } = parseKey(key);
                            const encrypted = cifra.encryptString(text, chaveInt);

                            console.log('\nTexto encriptado => ', encrypted);
                            console.log('Chave usada => ', chaveOriginal); //Exibe a chave exara digitada
                            console.log('Anote esses valores para descriptar!');
                        } catch(erro) {
                            console.log('Erro:', erro.message);
                        }
                        menu();
                    });
                });
                break;

            case '2':
                r1.question('Texto encriptado (16 caracteres hexadecimais) => ', (encrypted) => {
                    if(!/^[0-9A-F]{16}$/i.test(encrypted)) {
                        console.log('O texto encriptado deve ter 16 caracteres hexadecimais!');
                        return menu();
                    }
                    r1.question('Digite a chave usada anteriormente =>  ', (key) => {
                        try {
                            const chaveOrigial = key.trim();
                            const { numeric: chaveInt } = parseKey(key);
                            const decrypted = cifra.decryptString(encrypted, chaveInt);

                            //Filtra caracteres não ASCII
                            const clean = decrypted.replace(/[^\x20-\x7E]/g, '');

                            if(clean.length !== decrypted.length) {
                                console.log('\nAviso: Alguns caracteres inválidos foram removidos');
                            }

                            console.log('\nTexto decriptado => ', clean || '[Não foi possível decriptar]');
                            console.log('Dica: Verifique se a chave e texto encriptado estão corretos');
                        } catch(erro) {
                            console.log('Erro => ', erro.message);
                        }
                        menu();
                    });
                });
                break;

            case '3':
                r1.close();
                break;

            default:
                console.log('Opção inválida!');
                menu();
        }
    });
}

// Inicia o programa
console.log('Bem vindo(a) ao sistema de Cifra de Feistel!');
console.log('Você pode usar chaves decimais (123456) ou hexadecimais (DEADBEEF)');
menu();