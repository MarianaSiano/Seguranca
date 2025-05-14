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
        for (let i = 0; i < this.rounds; i++) {
            subChaves.push(current);
            current = ((current << 1) | (current >>> 31)) & 0xFFFFFFFF;
        }
        return subChaves;
    }

    encryptBlocks(block, key) {
        let [left, right] = this.splitBlock(block);
        const subChaves = this.generateSubChaves(key);

        for (let i = 0; i < this.rounds; i++) {
            const temp = right;
            right = left ^ this.f(subChaves[i], right);
            left = temp;
        }

        return this.joinBlocks(left, right);
    }

    decryptBlock(block, key) {
        let [left, right] = this.splitBlock(block);
        const subChaves = this.generateSubChaves(key);

        for (let i = this.rounds - 1; i >= 0; i--) {
            const temp = left;
            left = right ^ this.f(subChaves[i], left);
            right = temp;
        }

        return this.joinBlocks(left, right);
    }

    encryptString(text, key) {
        const buffer = Buffer.from(text, 'utf8');
        let block = 0n;

        for (let i = 0; i < Math.min(8, buffer.length); i++)
            block = (block << 8n) | BigInt(buffer[i]);

        //Padding para garantir 8 bytes
        while ((block >> 64n) !== 0n)
            block >>= 8n;

        const encrypted = this.encryptBlocks(block, key);
        return encrypted.toString(16).padStart(16, '0').toUpperCase();
    }

    decryptString(hex, key) {
        try {
            const block = BigInt('0x' + hex);
            const decrypted = this.decryptBlock(block, key);
            const bytes = [];
            let temp = decrypted;

            for(let i = 0; i < 8; i++) {
                bytes.unshift(Number(temp & 0xFFn));
                temp >>= 8n;
            }

            //Remove padding zeros
            while(bytes.length > 1 && bytes[0] === 0)
                bytes.shift();

            return Buffer.from(bytes).toString('utf8');
        } catch(erro) {
            return "[Decriptação falhou - verifique a chave e o texto encriptado]";
        }
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
    //Verifica se o input é válido
    if(input === null || input === undefined)
        throw new Error('Chave não pode ser nula');

    //Converte para string se não for
    const strInput = String(input).trim().toLocaleUpperCase();

    //Remove o prefixo '0x' se existir
    const cleanInput = strInput.startsWith('0x') ? strInput.slice(2) : strInput;

    //Verifica se é hexadecimal válido
    if(/^[0-9A-F]+$/.test(cleanInput)) {
        if(cleanInput.length > 8) {
            throw new Error('Chave hexadecimal deve ter no máximo 8 caracteres (32 bits)');
        }

        const num = parseInt(cleanInput, 16);
        if(isNaN(num)) throw new Error('Valor hexadecimal inválido');
        return num;
    }

    //Verifica se é decimal válido
    if(/^\d+$/.test(cleanInput)) {
        const num = parseInt(cleanInput, 10);

        if(isNaN(num)) throw new Error('Valor decimal invalido');
        if(num > 0xFFFFFFFF) {
            throw new Error('Chave deve ser menor que 4294967295 (FFFF FFFF em hex)');
        }
        return num;
    }
    throw new Error(`Fortato invalido: "${input}". Use decimal (ex.: 123456) ou hexadecimal (ex.: DEADBEEF)`);
}

function menu() {
    console.log('\n=========== Cifra de Feistel ==============');
    console.log('1. Encriptar bloco hexadecimal');
    console.log('2. Decriptar bloco hexadecimal');
    console.log('3. Encriptar texto');
    console.log('4. Decriptar texto');
    console.log('5. Sair');
    console.log('\nDica: Chave pode ser decimal (123456) ou hex (DEADBEEF)');

    r1.question('Escolha uma opção (1-5) => ', (choice) => {
        switch (choice) {
            case '1':
                r1.question('Digite o bloco hexadecimal (16 caracteres) => ', (block) => {
                    if (!/^[0-9A-Fa-f]{16}$/.test(block)) {
                        console.log('Erro => O bloco deve ter exatamente 16 caracteres hexadecimais');
                        return menu();
                    }
                    r1.question('Digite a chave => ', (key) => {
                        try {
                            const blockBigInt = BigInt('0x' + block);
                            const chaveInt = parseKey(key);
                            const encrypted = cifra.encryptBlock(blockBigInt, chaveInt);
                            console.log('Resultado =>', encrypted.toString(16).padStart(16, '0').toUpperCase());
                        } catch (erro) {
                            console.log('Erro =>', erro.message);
                        }
                        menu();
                    });
                });
                break;

            case '2':
                r1.question('Digite o bloco encriptado (16 caracteres hex) => ', (block) => {
                    if (!/^[0-9A-Fa-f]{16}$/.test(block)) {
                        console.log('Erro: O bloco deve ter exatamente 16 caracteres hexadecimais');
                        return menu();
                    }
                    r1.question('Digite a chave => ', (key) => {
                        try {
                            const blockBigInt = BigInt('0x' + block);
                            const chaveInt = parseKey(key);
                            const decrypted = cifra.decryptBlock(blockBigInt, chaveInt);
                            console.log('Resultado =>', decrypted.toString(16).padStart(16, '0').toUpperCase());
                        } catch (erro) {
                            console.log('Erro =>', erro.message);
                        }
                        menu();
                    });
                });
                break;

            case '3':
                r1.question('Texto para encriptar => ', (text) => {
                    r1.question('Digite a chave => ', (key) => {
                        try {
                            const chaveInt = parseKey(key);
                            const encrypted = cifra.encryptString(text, chaveInt);
                            console.log('\nTexto encriptado=> ', encrypted.toUpperCase());
                            console.log('Chave usada => ', chaveInt);
                            console.log('Copie EXATAMENTE esses valores para decriptar!');
                        } catch (e) {
                            console.log('❌ Erro:', e.message);
                        }
                        menu();
                    });
                });
                break;

            case '4':
                r1.question('Cole o texto encriptado (EXATO) => ', (encrypted) => {
                    if (!/^[0-9A-F]{16}$/i.test(encrypted)) {
                        console.log('O texto encriptado deve ter 16 caracteres hexadecimais!');
                        return menu();
                    }
                    r1.question('Digite a chave EXATA usada =>  ', (key) => {
                        try {
                            const chaveInt = parseKey(key);
                            const decrypted = cifra.decryptString(encrypted, chaveInt);

                            //Filtra caracteres não ASCII
                            const clean = decrypted.replace(/[^\x20-\x7E]/g, '');

                            if (clean.length !== decrypted.length) {
                                console.log('\nAviso: Alguns caracteres inválidos foram removidos');
                            }

                            console.log('\nTexto decriptado => ', clean || '[Não foi possível decriptar]');
                            console.log('Dica: Verifique se a chave e texto encriptado estão corretos');
                        } catch (e) {
                            console.log('Erro => ', e.message);
                        }
                        menu();
                    });
                });
                break;

            case '5':
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