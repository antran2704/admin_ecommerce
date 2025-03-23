import axios from "axios";
import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";

import { INTERNAL_PATH } from "~/config/constants";
import {
  IForgotPassword,
  ILogin,
  ISendOTP,
  ISignup,
  IVerifyOTP,
} from "~/interface/auth";

const login = async (body: ILogin) => {
  return await axios
    .post(BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/user/sign-in", body)
    .then((res) => res.data);
};

const signup = async (body: ISignup) => {
  return await axios
    .post(BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/user/sign-up", body)
    .then((res) => res.data);
};

const isInForgotPassword = async (email: string) => {
  return await axios
    .post(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/user/is-in-forgotten-password-progress",
      {
        email,
      },
    )
    .then((res) => res.data);
};

const isExitUser = async (email: string) => {
  return await axios
    .post(BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/user/is-exist", {
      email,
    })
    .then((res) => res.data);
};

const resetPassword = async (body: IForgotPassword) => {
  return await axios
    .post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/user/reset-password",
      body,
    )
    .then((res) => res.data);
};

const logout = async () => {
  return await AxiosClient.post(
    BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/user/revoke",
  );
};

const resendOTP = async (data: ISendOTP) => {
  return await axios
    .post(BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/user/resend-otp", data)
    .then((res) => res.data);
};

const verifyOTP = async (data: IVerifyOTP) => {
  return await axios
    .post(BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/user/verify-otp", data)
    .then((res) => res.data);
};


export {
  signup,
  login,
  isInForgotPassword,
  isExitUser,
  resetPassword,
  logout,
  resendOTP,
  verifyOTP,
};
