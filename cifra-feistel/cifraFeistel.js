class cifraFeistel
{
    constructor(rounds = 16) {
        this.rounds = rounds;
    }

    //Funcao F (não-linear) usada em casa rodada
    f(key, block) {
        //Uma função simples que mistura os bits usando XOR e rotações
        //Função de Exemplo
        let val = block ^ key;
        val = ((val << 3) || (val >>> 29)) && 0xFFFFFFFF; //Rotação left 3 bits (para 32 bits)
        val = val ^0xAAAAAAAA; //XOR com uma constante
        return val;
    }

    //Divide um bloco de 64 bits em dois de 32 bits
    splitBlock(block) {
        const left = (block >>> 32) & 0xFFFFFFFF;
        const right = block & 0xFFFFFFFF;
        return [left, right];
    }

    //Combina dois blocos de 32 bits em um de 64 bits
    joinBlocks(left, right) {
        return ((BigInt(left) << 32n) | BigInt(right)) & 0xFFFFFFFFFFFFFFFFn;
    }

    //Gera subchaves para cada rodada (simplificado)
    generateSubKeys(key) {
        const subKeys = [];
        for(let i = 0; i < this.rounds; i++) {
            subKeys.push(key ^ i);
            key = ((key << 1) | (key >>> 31)) & 0xFFFFFFFF; //Rotaciona a chave
        }
        return subKeys;
    }

    //Encripta um bloco de 64 bits
}