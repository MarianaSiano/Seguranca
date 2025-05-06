//Definição de roles e permissões
const roles = {
    admin: {
        can: ['read', 'create', 'update', 'delete', 'manage_users'],
        inherits: ['editor']
    },
    editor: {
        can: ['read', 'creat', 'update'],
        inherits: ['viewer']
    },
    viewer: {
        can: ['read']
    }
};

//Verifica se um role tem determinada permissão
const checkPermission = (role, permission) => {
    if(!roles[role])
        return false;

    if(roles[role].can.includes(permission))
        return true;

    if(roles[role].inherits){
        return roles[role].inherits.some(inheritedRole => checkPermission(inheritedRole, permission));
    }

    return false;
};

//Verifica se o usuário tem permissão
export const hasPermission = (userRoles, permission) => {
    return userRoles.some(role => checkPermission(role, permission));
};