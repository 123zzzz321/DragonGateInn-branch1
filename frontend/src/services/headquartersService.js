import api from './api';

export const getHeadquartersDashboardData = async (branchId) => {
  const params = branchId ? { branchId } : {};
  const response = await api.get('/headquarters/dashboard', { params });
  return response.data;
};

export const getAllBranches = async () => {
  const response = await api.get('/headquarters/branches');
  return response.data;
};

export const createBranch = async (branchData) => {
  const response = await api.post('/headquarters/branches', branchData);
  return response.data;
};

export const updateBranch = async (branchId, branchData) => {
  const response = await api.put(`/headquarters/branches/${branchId}`, branchData);
  return response.data;
};

export const deleteBranch = async (branchId) => {
  const response = await api.post(`/headquarters/branches/${branchId}/disable`);
  return response.data;
};
