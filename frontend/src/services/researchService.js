import api from './api';

export const createResearch  = (data) => api.post('/research', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getResearch     = (id)   => api.get(`/research/${id}`);
export const listResearch    = (params) => api.get('/research', { params });
