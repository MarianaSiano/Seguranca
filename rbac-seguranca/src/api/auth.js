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

export const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        //Simula delay de rede
        setTimeout(() => {
            const user = users.find(u => u.email === email && u.password === password);

            if(user) {
                resolve({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    roles: user.roles
                });
            } else {
                reject(new Error('Credenciais inválidas'));
            }
        }, 500); //0.5s delay para simular chamada API
    });
};

export const logout = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 200);
    });
};