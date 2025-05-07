//Dados de usuários simulados
const users = [
    {
        id: 1,
        name: 'Diretor',
        email: 'diretoria@escola.com',
        password: 'diretoria@admin123',
        roles: ['diretoria']
    },
    {
        id: 2,
        name: 'Professor',
        email: 'professor@escola.com',
        password: 'professor@123',
        roles: ['professor']
    },
    {
        id: 3,
        name: 'Aluno',
        email: 'aluno@escola.com',
        password: 'alunoX@123',
        roles: ['aluno']
    }
];

//Função de login simulada
export const login = async (email, password) => {
    // Encontra o usuário com email correspondente
    const user = users.find(u => u.email === email);

    //Verifica se usuário existe e se a senha está correta
    if (!user || user.password !== password) {
        throw new Error('Usuário ou senha inválidos');
    }

    //Retorna os dados do usuário sem a senha
    const { password: _, ...userData } = user;
    return userData;
};

export const logout = async () => {
    //Limpeza de sessão pode ser feita aqui
    return true;
};