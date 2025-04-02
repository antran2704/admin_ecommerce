import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import { ICreateUserRequest, IGetUsersRequest, IIsExitUserRequest, IResetPasswordUserRequest, IUpdateUserRequest } from "~/page/User/interfaces";

const apiUserService = {
  users: async (paramater: Partial<IGetUsersRequest>) => {
    const parseParamater = parseQueryString(paramater);

    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/users" + parseParamater,
    ).then((res) => res.data);
  },
  user: async (userId: string) => {
    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/users/${userId}`,
    ).then((res) => res.data);
  },
  isExitUser: async (data: IIsExitUserRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/users/is-exit-user",
      data,
    ).then((res) => res.data);
  },
  create: async (data: ICreateUserRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/users",
      data,
    ).then((res) => res.data);
  },
  update: async (id: string, data: IUpdateUserRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/users/${id}`,
      data,
    ).then((res) => res.data);
  },
  resetPassword: async (userId: string, data: IResetPasswordUserRequest) => {
    return await AxiosClient.patch(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/users/${userId}/reset-password`,
      data,
    ).then((res) => res.data);
  },
  uploadAvatar: async (file: File) => {
    const formData: FormData = new FormData();
    formData.append("file", file);

    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/users/upload-avatar",
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
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/users/${id}/enable`,
    ).then((res) => res.data);
  },
  disable: async (id: string) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/users/${id}/disable`,
    ).then((res) => res.data);
  },
  ban: async (id: string) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/users/${id}/ban`,
    ).then((res) => res.data);
  },
  unban: async (id: string) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/users/${id}/unban`,
    ).then((res) => res.data);
  },
  delete: async (id: string) => {
    return await AxiosClient.delete(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/users/${id}`,
    ).then((res) => res.data);
  },
};

export { apiUserService };
