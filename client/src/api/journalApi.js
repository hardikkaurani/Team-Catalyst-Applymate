import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const journalApi = {
  getAll: (params) => axiosClient.get(API_ROUTES.JOURNAL.BASE, { params }),
  getById: (id) => axiosClient.get(API_ROUTES.JOURNAL.BY_ID(id)),
  create: (data) => axiosClient.post(API_ROUTES.JOURNAL.BASE, data),
  update: (id, data) => axiosClient.patch(API_ROUTES.JOURNAL.BY_ID(id), data),
  delete: (id) => axiosClient.delete(API_ROUTES.JOURNAL.BY_ID(id)),
};
