import api from './api';
import useStore from '../store/useStore';

export const login = async (username, password, accountType) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
      accountType
    });
    useStore.getState().setUser(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (username, password, accountType) => {
  try {
    const response = await api.post('/auth/register', {
      username,
      password,
      accountType
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    useStore.getState().clearUser();
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCurrentUser = async () => {
  const user = useStore.getState().user;
  if (!user) {
    throw new Error('未登录');
  }
  try {
    const response = await api.get('/auth/me');
    useStore.getState().setUser(response.data);
    return response.data;
  } catch (error) {
    useStore.getState().clearUser();
    throw error.response?.data || error.message;
  }
};

export default api;