import api from './api';

export const getCheckIns = async () => {
  const response = await api.get('/branch/checkins');
  return response.data;
};

export const createCheckIn = async (checkInData) => {
  const response = await api.post('/branch/checkins', checkInData);
  return response.data;
};

export const checkOut = async (checkInId) => {
  const response = await api.post(`/branch/checkins/${checkInId}/checkout`);
  return response.data;
};

export const addConsumption = async (checkInId, consumptionData) => {
  const response = await api.post(`/branch/checkins/${checkInId}/consumption`, consumptionData);
  return response.data;
};
