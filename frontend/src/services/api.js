import axios from 'axios';
import useStore from '../store/useStore';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // 使用zustand的方式获取用户信息
  const user = useStore.getState().user;
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const getErrorMessage = (error, fallback = '请求失败，请稍后重试') => {
  if (typeof error === 'string') {
    return error;
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (typeof error?.response?.data === 'string') {
    return error.response.data;
  }
  if (error?.message) {
    return error.message;
  }
  return fallback;
};

export default api;
