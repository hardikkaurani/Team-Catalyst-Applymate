import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const timelineApi = {
  getFeed: (params) => axiosClient.get(API_ROUTES.TIMELINE, { params }),
};
