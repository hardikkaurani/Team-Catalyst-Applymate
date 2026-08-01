import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const actionApi = {
  getActions: () => axiosClient.get(API_ROUTES.ACTIONS),
};
