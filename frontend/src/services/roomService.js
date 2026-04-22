import api from './api';

export const getRooms = async () => {
  const response = await api.get('/branch/rooms');
  return response.data;
};

export const addRoom = async (roomData) => {
  const response = await api.post('/branch/rooms', roomData);
  return response.data;
};

export const updateRoom = async (roomId, roomData) => {
  const response = await api.put(`/branch/rooms/${roomId}`, roomData);
  return response.data;
};

export const deleteRoom = async (roomId) => {
  const response = await api.delete(`/branch/rooms/${roomId}`);
  return response.data;
};
