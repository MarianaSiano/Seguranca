//Dados de usuários simulados
const users = [
    {
        id: 1,
        name: 'admin',
        password: 'admin123',
        roles: ['admin']
    },
    {
        id: 2,
        name: 'editor',
        password: 'editor123',
        roles: ['editor']
    },
    {
        id: 3,
        name: 'viewer',
        password: 'viewer123',
        roles: ['viewer']
    }
];

//Função de login simulada
export const login = async (username, password) => {
    const user = users.find(user1 => user1.username === username && user1.password === password);

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
