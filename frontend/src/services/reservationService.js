import api from './api';

export const getReservations = async (status) => {
  const params = status ? { status } : {};
  const response = await api.get('/branch/reservations', { params });
  return response.data;
};

export const confirmReservation = async (reservationId) => {
  const response = await api.post(`/branch/reservations/${reservationId}/confirm`);
  return response.data;
};

export const cancelReservation = async (reservationId) => {
  const response = await api.post(`/branch/reservations/${reservationId}/cancel`);
  return response.data;
};
