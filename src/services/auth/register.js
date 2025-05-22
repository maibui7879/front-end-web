import apiRequest from '../common/apiRequest';

const register = async (full_name, email, password) => {
    return await apiRequest('/auth/register', 'POST', { full_name, email, password }, false);
};

export default register;
