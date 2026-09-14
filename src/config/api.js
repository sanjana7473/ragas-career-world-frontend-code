// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Auth
  USER_LOGIN: `${API_BASE_URL}/api/auth/user/login`,
  USER_REGISTER: `${API_BASE_URL}/api/auth/user/register`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/auth/admin/login`,
  ADMIN_REGISTER: `${API_BASE_URL}/api/auth/admin/register`,
  PARTNER_LOGIN: `${API_BASE_URL}/api/auth/partner/login`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/user/forgot-password`,

  // Candidates
  CANDIDATES: `${API_BASE_URL}/api/candidates`,
  CANDIDATE_DETAILS: (id) => `${API_BASE_URL}/api/candidates/${id}`,

  // Jobs
  JOBS: `${API_BASE_URL}/api/jobs`,
  JOB_DETAILS: (id) => `${API_BASE_URL}/api/jobs/${id}`,

  // Applications
  APPLICATIONS: `${API_BASE_URL}/api/applications`,
  APPLICATION_DETAILS: (id) => `${API_BASE_URL}/api/applications/${id}`,

  // Resumes
  RESUME: `${API_BASE_URL}/api/resume`,

  // Employers
  EMPLOYERS: `${API_BASE_URL}/api/employers`,
  EMPLOYER_DETAILS: (id) => `${API_BASE_URL}/api/employers/${id}`,

  // Partners
  PARTNERS: `${API_BASE_URL}/api/partners`,
  PARTNER_DETAILS: (id) => `${API_BASE_URL}/api/partners/${id}`,

  // Contact
  CONTACT: `${API_BASE_URL}/api/contact`,

  // Chatbot Logs
  CHATBOT_LOGS: `${API_BASE_URL}/api/chatbot-logs`,
};
