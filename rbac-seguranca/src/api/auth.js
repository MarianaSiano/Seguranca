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
        email: 'professorX@escola.com',
        password: 'professorX@123',
        roles: ['professor']
    },
    {
        id: 3,
        name: 'Aluno',
        email: 'alunoX@escola.com',
        password: 'alunoX@123',
        roles: ['aluno']
    }
];

//Função de login simulada
export const login = async (email, password) => {
    const user = users.find(user1 => user1.email === email && user1.password === password);

    if(!user) {
        throw new Error('Usuário ou senha inválidos');
    }

    return {
        id: user.id,
        name: user.name,
        roles: user.roles,
        token: 'simulated-token-' + user.id //Token simulado
    };
};

//Função de logout simulada
export const logout = async () => {
    return true; //Simula o logout
}
