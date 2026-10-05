import api from './api';

export const careerService = {
  getProfile: () => api.get('/career/profile'),
  getSkillGaps: () => api.get('/career/skill-gaps'),
  getRecommendedJobs: () => api.get('/career/recommended-jobs'),
  simulateSkills: (data) => api.post('/career/simulate', data),
  getRoadmap: () => api.get('/career/roadmap'),
  getOpportunityImpact: () => api.get('/career/opportunity-impact'),
  getSkillGraph: () => api.get('/career/skill-graph'),
};

export const platformService = {
  getSkills: () => api.get('/skills'),
};
