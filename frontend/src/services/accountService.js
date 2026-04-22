import api from './api';

export const getAllAccounts = async () => {
  const response = await api.get('/accounts');
  return response.data;
};

export const createAccount = async (accountData) => {
  const response = await api.post('/accounts', accountData);
  return response.data;
};

export const updateAccount = async (accountId, accountData) => {
  const response = await api.put(`/accounts/${accountId}`, accountData);
  return response.data;
};

export const disableAccount = async (accountId) => {
  const response = await api.post(`/accounts/${accountId}/deactivate`);
  return response.data;
};

export const enableAccount = async (accountId) => {
  const response = await api.put(`/accounts/${accountId}/enable`);
  return response.data;
};
