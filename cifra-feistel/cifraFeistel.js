class cifraFeistel 
{
    constructor(rounds = 16) {
        this.rounds = rounds;
    }

    f(key, block) {
        let val = block ^ BigInt(key);
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
        return ((BigInt(left) << 32n) | BigInt(right)) & 0xFFFFFFFFFFFFFFFFn;
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
    encryptBlock(block, key) {
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

        const encrypted = this.encryptBlock(block, key);
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

const cifra = new cifraFeistel(16);
const chave = 0xDEADBEEF;

const originalBlock = 0x0123456789ABCDEFn;
console.log('Bloco original:', originalBlock.toString(16));

const encryptedBlock = cifra.encryptBlock(originalBlock, chave);
console.log('Bloco encriptado:', encryptedBlock.toString(16));

const decryptedBlock = cifra.decryptBlock(encryptedBlock, chave);
console.log('Bloco decriptado:', decryptedBlock.toString(16));

//Exemplo com string
const text = "Feistel";
console.log('Texto original:', text);

const encryptedText = cifra.encryptString(text, chave);
console.log('Texto encriptado:', encryptedText);

const decryptedText = cifra.decryptString(encryptedText, chave);
console.log('Texto decriptado:', decryptedText);