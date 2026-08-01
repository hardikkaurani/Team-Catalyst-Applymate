import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const insightApi = {
  getFunnel: () => axiosClient.get(API_ROUTES.INSIGHTS.FUNNEL),
  getWeakestRound: () => axiosClient.get(API_ROUTES.INSIGHTS.WEAKEST_ROUND),
  getTopicFrequency: () => axiosClient.get(API_ROUTES.INSIGHTS.TOPIC_FREQUENCY),
  getResponseTime: () => axiosClient.get(API_ROUTES.INSIGHTS.RESPONSE_TIME),
};
