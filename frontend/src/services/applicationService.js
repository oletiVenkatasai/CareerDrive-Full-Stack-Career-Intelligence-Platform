import api from './api';

export const applicationService = {
  applyForJob: (data) => api.post('/applications', data),
  getMyApplications: (params) => api.get('/applications/my', { params }),
  getJobApplications: (jobId, params) => api.get(`/applications/job/${jobId}`, { params }),
  updateApplicationStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};
