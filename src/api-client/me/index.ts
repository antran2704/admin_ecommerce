import { API_VERSION, BASE_URL } from "~/common/api";
import { INTERNAL_PATH } from "~/config/constants";
import AxiosClient from "~/config/axiosClient";
import {
  IChangePasswordMeRequest,
  IMeProfile,
  IUpdateMeRequest,
} from "~/page/Account/interfaces";

const apiMeService = {
  getProfile: async (): Promise<IMeProfile> => {
    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/me",
    ).then((res) => res.data);
  },
  getPermissions: async (): Promise<{ permissions: string[] }> => {
    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/me/permissions",
    ).then((res) => res.data);
  },
  getRefreshToken: async (accessToken: string, refreshToken: string) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + "/auth/admin/refresh-token",
      {
        accessToken,
        refreshToken,
      },
    ).then((res) => res.data);
  },
  update: async (payload: IUpdateMeRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/me",
      payload,
    ).then((res) => res.data);
  },
  changePassword: async (payload: IChangePasswordMeRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/me/change-password",
      payload,
    ).then((res) => res.data);
  },
  uploadAvatar: async (file: File) => {
    const formData: FormData = new FormData();
    formData.append("file", file);

    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/me/upload-avatar",
      formData,
      { headers: {
        "Content-Type": file.type,
      },}
    ).then((res) => res.data);
  },
};

export default apiMeService;
