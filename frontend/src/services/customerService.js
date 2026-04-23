import api from './api';

export const getAllBranches = async () => {
  const response = await api.get('/customer/branches');
  return response.data;
};

export const getAvailableRooms = async (branchId) => {
  const response = await api.get(`/customer/branches/${branchId}/rooms`);
  return response.data;
};

export const createReservation = async (reservationData) => {
  const response = await api.post('/customer/reservations', reservationData);
  return response.data;
};

export const getMyReservations = async () => {
  const response = await api.get('/customer/reservations');
  return response.data;
};

export const cancelReservation = async (reservationId) => {
  const response = await api.post(`/customer/reservations/${reservationId}/cancel`);
  return response.data;
};

export const getCustomerDashboard = async () => {
  const response = await api.get('/customer/dashboard');
  return response.data;
};

export const getCustomerProfile = async () => {
  const response = await api.get('/customer/profile');
  return response.data;
};

export const updateCustomerProfile = async (profileData) => {
  const response = await api.put('/customer/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/customer/password', passwordData);
  return response.data;
};
