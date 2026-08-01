export const API_ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  COMPANIES: {
    BASE: '/companies',
    BY_ID: (id) => `/companies/${id}`,
    STATUS: (id) => `/companies/${id}/status`,
    EXPORT_CSV: '/companies/export/csv',
  },
  RESOURCES: {
    BASE: '/resources',
    BY_ID: (id) => `/resources/${id}`,
    PROGRESS: '/resources/progress',
  },
  JOURNAL: {
    BASE: '/journal',
    BY_ID: (id) => `/journal/${id}`,
  },
  TIMELINE: '/timeline',
  ACTIONS: '/actions',
  INSIGHTS: {
    FUNNEL: '/insights/funnel',
    WEAKEST_ROUND: '/insights/weakest-round',
    TOPIC_FREQUENCY: '/insights/topic-frequency',
    RESPONSE_TIME: '/insights/response-time',
  },
  PROFILE: {
    BASE: '/profile',
    PASSWORD: '/profile/password',
  },
};
