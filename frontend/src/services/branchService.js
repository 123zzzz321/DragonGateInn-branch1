import api from './api';

export const getBranchDashboardData = async () => {
  const response = await api.get('/branch/dashboard');
  return response.data;
};

export const getBranchRooms = async () => {
  const response = await api.get('/branch/rooms');
  return response.data;
};

export const addBranchRoom = async (roomData) => {
  const response = await api.post('/branch/rooms', roomData);
  return response.data;
};

export const updateBranchRoom = async (roomId, roomData) => {
  const response = await api.put(`/branch/rooms/${roomId}`, roomData);
  return response.data;
};

export const setRoomAvailability = async (roomId, isAvailable) => {
  const response = await api.post(`/branch/rooms/${roomId}/availability`, { isAvailable });
  return response.data;
};

export const getBranchReservations = async () => {
  const response = await api.get('/branch/reservations');
  return response.data;
};

export const confirmBranchReservation = async (reservationId) => {
  const response = await api.post(`/branch/reservations/${reservationId}/confirm`);
  return response.data;
};

export const cancelBranchReservation = async (reservationId) => {
  const response = await api.post(`/branch/reservations/${reservationId}/cancel`);
  return response.data;
};

export const getBranchCheckIns = async () => {
  const response = await api.get('/branch/checkins');
  return response.data;
};

export const createBranchCheckIn = async (checkInData) => {
  const response = await api.post('/branch/checkins', checkInData);
  return response.data;
};

export const checkout = async (checkInId) => {
  const response = await api.post(`/branch/checkins/${checkInId}/checkout`);
  return response.data;
};
