import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const companyApi = {
  getAll: (params) => axiosClient.get(API_ROUTES.COMPANIES.BASE, { params }),
  getById: (id) => axiosClient.get(API_ROUTES.COMPANIES.BY_ID(id)),
  create: (data) => {
    // Handle form data if resume is uploaded as a File
    if (data instanceof FormData) {
      return axiosClient.post(API_ROUTES.COMPANIES.BASE, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosClient.post(API_ROUTES.COMPANIES.BASE, data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return axiosClient.patch(API_ROUTES.COMPANIES.BY_ID(id), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosClient.patch(API_ROUTES.COMPANIES.BY_ID(id), data);
  },
  delete: (id) => axiosClient.delete(API_ROUTES.COMPANIES.BY_ID(id)),
  updateStatus: (id, status) =>
    axiosClient.patch(API_ROUTES.COMPANIES.STATUS(id), { status }),
  exportCsv: () =>
    axiosClient.get(API_ROUTES.COMPANIES.EXPORT_CSV, {
      responseType: 'blob',
    }),
};
