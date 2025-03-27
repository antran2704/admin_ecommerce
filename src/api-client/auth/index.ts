import axios from "axios";
import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";

import { INTERNAL_PATH } from "~/config/constants";
import {
  IConfirmForgotPasswordOtp,
  ILogin,
} from "~/interface/auth";
import {
  IForgotPasswordOtpResponse,
  IForgotPasswordRequest,
} from "~/page/Public/interfaces/forgotPassword.interface";
import { IResetPasswordRequest } from "~/page/Public/interfaces/resetPassword.interface";

const apiAuthService = {
  login: async (body: ILogin) => {
    return await axios
      .post(BASE_URL + API_VERSION.V1 + "/auth/admin/login", body)
      .then((res) => res.data);
  },
  forgotPassword: async (
    body: IForgotPasswordRequest,
  ): Promise<IForgotPasswordOtpResponse> => {
    return await axios
      .post(BASE_URL + API_VERSION.V1 + "/auth/admin/forgot-password", body)
      .then((res) => res.data);
  },
  isInForgotPassword: async (
    body: IForgotPasswordRequest,
  ): Promise<boolean> => {
    return await axios
      .post(BASE_URL + API_VERSION.V1 + "/auth/admin/is-in-forgot-password", body)
      .then((res) => res.data);
  },
  confirmForgotPasswordOtp: async (body: IConfirmForgotPasswordOtp) => {
    return await axios
      .post(
        BASE_URL + API_VERSION.V1 + "/auth/admin/confirm-forgot-password-otp",
        body,
      )
      .then((res) => res.data);
  },

  resetPassword: async (body: IResetPasswordRequest) => {
    return await axios
      .post(
        BASE_URL +
          API_VERSION.V1 +
          "/auth/admin/reset-password",
        body,
      )
      .then((res) => res.data);
  },
  logout: async () => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/auth/admin/logout",
    );
  },
};

export default apiAuthService;
