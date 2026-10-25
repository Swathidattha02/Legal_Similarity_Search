import api from './api';

export const uploadDocument  = (formData) => api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const listDocuments   = ()         => api.get('/documents');
export const getDocument     = (id)       => api.get(`/documents/${id}`);

export const getSavedCases   = ()         => api.get('/saved-cases');
export const saveCase        = (data)     => api.post('/saved-cases', data);
export const removeSavedCase = (id)       => api.delete(`/saved-cases/${id}`);
export const updateNotes     = (id, notes) => api.patch(`/saved-cases/${id}/notes`, { notes });

export const getHistory      = (params)   => api.get('/history', { params });
export const clearHistory    = ()         => api.delete('/history');
