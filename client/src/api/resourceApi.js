import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const resourceApi = {
  getAll: (params) => axiosClient.get(API_ROUTES.RESOURCES.BASE, { params }),
  getById: (id) => axiosClient.get(API_ROUTES.RESOURCES.BY_ID(id)),
  create: (data) => axiosClient.post(API_ROUTES.RESOURCES.BASE, data),
  update: (id, data) => axiosClient.patch(API_ROUTES.RESOURCES.BY_ID(id), data),
  delete: (id) => axiosClient.delete(API_ROUTES.RESOURCES.BY_ID(id)),
  getProgress: () => axiosClient.get(API_ROUTES.RESOURCES.PROGRESS),
};
