import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const authApi = {
  register: (data) => axiosClient.post(API_ROUTES.AUTH.REGISTER, data),
  login: (data) => axiosClient.post(API_ROUTES.AUTH.LOGIN, data),
  getMe: () => axiosClient.get(API_ROUTES.AUTH.ME),
  updateProfile: (data) => axiosClient.patch(API_ROUTES.PROFILE.BASE, data),
  changePassword: (data) => axiosClient.patch(API_ROUTES.PROFILE.PASSWORD, data),
};
