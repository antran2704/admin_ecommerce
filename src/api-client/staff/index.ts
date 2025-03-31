import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";

import {
  ICreateStaffRequest,
  IGetStaffsRequest,
  IIsExitStaffRequest,
  IResetPasswordStaffRequest,
  IUpdateStaffRequest,
} from "~/page/Staff/interfaces";

const apiStaffService = {
  staffs: async (paramater: Partial<IGetStaffsRequest>) => {
    const parseParamater = parseQueryString(paramater);

    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admins" + parseParamater,
    ).then((res) => res.data);
  },
  staff: async (userId: string) => {
    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admins/${userId}`,
    ).then((res) => res.data);
  },
  isExitUser: async (data: IIsExitStaffRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admins/is-exit-user",
      data,
    ).then((res) => res.data);
  },
  create: async (data: ICreateStaffRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admins",
      data,
    ).then((res) => res.data);
  },
  update: async (id: string, data: IUpdateStaffRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admins/${id}`,
      data,
    ).then((res) => res.data);
  },
  resetPassword: async (userId: string, data: IResetPasswordStaffRequest) => {
    return await AxiosClient.patch(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admins/${userId}/reset-password`,
      data,
    ).then((res) => res.data);
  },
  uploadAvatar: async (file: File) => {
    const formData: FormData = new FormData();
    formData.append("file", file);

    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admins/upload-avatar",
      formData,
      {
        headers: {
          "Content-Type": file.type,
        },
      },
    ).then((res) => res.data);
  },
  enable: async (id: string) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admins/${id}/enable`,
    ).then((res) => res.data);
  },
  disable: async (id: string) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admins/${id}/disable`,
    ).then((res) => res.data);
  },
  delete: async (id: string) => {
    return await AxiosClient.delete(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admins/${id}`,
    ).then((res) => res.data);
  },
};

export { apiStaffService };
