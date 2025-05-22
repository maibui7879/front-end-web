import apiRequest from '../common/apiRequest';

const login = async (email, password) => {
    return await apiRequest('/auth/login', 'POST', { email, password }, false);
};

export default login;
