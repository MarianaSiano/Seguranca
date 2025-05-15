// const { parse } = require('path');
// const { threadId } = require('worker_threads');
const readline = require('readline');
const crypto = require('crypto');

class CifraFeistelSegura {
    constructor(rounds = 16) {
        this.rounds = rounds;
        this.blockSize = 8; //64 bits (8bytes)
    }

    //Função F baseada em HMAC-SHA256
    f(subChave, block) {
        const hmac = crypto.createHmac('sha256', Buffer.from(subChave));
        const blockBuf = Buffer.alloc(4);
        blockBuf.writeUInt32BE(Number(block & 0xFFFFFFFFn));
        hmac.update(blockBuf);
        const hash = hmac.digest();
        return BigInt('0x' + hash.slice(0, 4).toString('hex'));
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
        const baseKey = Buffer.alloc(4);
        baseKey.writeUInt32BE(key);
        const subChaves = [];

        for(let i = 0; i < this.rounds; i++) {
            const hmac = crypto.createHmac('sha256', baseKey);
            hmac.update(Buffer.from([i]));
            subChaves.push(hmac.digest().slice(0, 4));
        }
        return subChaves;
    }

    encryptBlock(block, subChaves) {
        let [left, right] = this.splitBlock(block);

        for(let i = 0; i < this.rounds; i++) {
            const temp = right;
            right = left ^ this.f(subChaves[i], right);
            left = temp;
        }
        return this.joinBlocks(left, right);
    }

    decryptBlock(block, subChaves) {
        let [left, right] = this.splitBlock(block);

        for(let i = this.rounds - 1; i >= 0; i--) {
            const temp = left;
            left = right ^ this.f(subChaves[i], left);
            right = temp;
        }
        return this.joinBlocks(left, right);
    }

    padPKCS7(data) {
        const paddingLenght = this.blockSize - (data.length % this.blockSize);
        return Buffer.concat([data, Buffer.alloc(paddingLenght, paddingLenght)]);
    }

    unpadPKCS7(data) {
        const padding = data[data.length - 1];
        return data.slice(0, data.length - padding);
    }

    encrypt(text, key) {
        const subChaves = this.generateSubChaves(key);
        const data = this.padPKCS7(Buffer.from(text, 'utf8'));
        //iv = Initialization Vector
        const iv = crypto.randomBytes(this.blockSize); //8 bytes (64 bits)
        const blocks = [];
        let previous = BigInt('0x' + iv.toString('hex'));

        for(let i = 0; i < data.length; i += this.blockSize) {
            let block = BigInt('0x' + data.slice(i, i + this.blockSize).toString('hex'));
            block ^= previous; //XOR com IV na primeira rodada

            const encrypted = this.encryptBlock(block, subChaves);
            blocks.push(encrypted);
            previous = encrypted; //Atualiza para CBC (Cipher Block Chaining)
        }
        const encryptedHex = blocks.map(b => b.toString(16).padStart(16, '0')).join('');
        return iv.toString('hex') + encryptedHex;
    }

    decrypt(cifraHex, key) {
        const subChaves = this.generateSubChaves(key);
        const iv = Buffer.from(cifraHex.slice(0, this.blockSize * 2), 'hex');
        const encryptedBlocks = cifraHex.slice(this.blockSize * 2);
        const blocks = [];

        for(let i = 0; i < encryptedBlocks.length; i += 16)
            blocks.push(BigInt('0x' + encryptedBlocks.slice(i, i + 16)));

        let previous = BigInt('0x' + iv.toString('hex'));
        const decrypted = [];

        for(let block of blocks) {
            const decryptedBlock = this.decryptBlock(block, subChaves) ^ previous;
            const buf = Buffer.alloc(this.blockSize);
            let temp = decryptedBlock;

            for(let i = this.blockSize - 1; i >= 0; i--) {
                buf[i] = Number(temp & 0xFFn);
                temp >>= 8n
            }
            decrypted.push(buf);
            previous = block; //CBC => Usa bloco anterior
        }
        return this.unpadPKCS7(Buffer.concat(decrypted)).toString('utf8');
    }
}

//Interface com o usuario
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cifra = new CifraFeistelSegura(16);

function menu() {
    console.log('\n============== Cifra de Feistel ==============');
    console.log('\n============== Menu ==============');
    console.log('1. Encriptar texto');
    console.log('2. Decriptar texto');
    console.log('3. Sair');

    r1.question('Escolha uma opção (1-3) => ', (opcao) => {
        switch(opcao.trim()) {
            case '1':
                r1.question('Digite o texto a ser criptografado => ', (texto) => {
                    r1.question('Digite a chave (numero inteiro) => ', (chave) => {
                        const chaveInt = parseInt(chave);

                        if(isNaN(chaveInt)) {
                            console.log('Chave invalida');
                            return menu();
                        }
                        const cifrado = cifra.encrypt(texto, chaveInt);
                        console.log(`Texto criptografado => ${cifrado}`);
                        menu();
                    });
                });
            break;

            case '2':
                r1.question('Digite o texto criptografado (hex) => ', (textoCriptografado) => {
                    r1.question('Digite a chave usada anteriormente (numero inteiro) => ', (chave) => {
                        const chaveInt = parseInt(chave);

                        if(isNaN(chaveInt)) {
                            console.log('Chave invalida!');
                            return menu();
                        }

                        try {
                            const decifrado = cifra.decrypt(textoCriptografado, chaveInt);
                            console.log(`Texto descriptografado => ${decifrado}`);
                        } catch(erro) {
                            console.log('Erro ao descriptografar. Verifique o texto e a chave.');
                        }
                        menu();
                    });
                });
            break;

            case '3':
                console.log('Saindo...');
                r1.close();
            break;

            default:
                console.log('Opcao invalida.');
            break;
        }
    });
}

// Inicia o programa
menu();