import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import { message } from "antd";
import { NavigateFunction } from "react-router-dom";

import { getAuthToken, removeAuthToken, setAuthToken } from "~/helper/auth";
import { IAuthToken } from "~/interface/auth";
import { AppDispatch } from "~/store/types";
import { logoutUser } from "~/store/slice/user";
import MESSAGE_ERROR from "~/common/errorMessage";
import { API_VERSION, BASE_URL } from "~/common/api";
import { getTimezoneOffset, getUserTimezone } from "~/helper/dateTime";
import apiMeService from "~/api-client/me";

let navigate: NavigateFunction;
let isRefreshToken: boolean = false;
let tError: any;
let dispatch: AppDispatch;

const MAX_RETRY: number = 3;

export const injectStore = (_dispatch: AppDispatch) => {
  dispatch = _dispatch;
};

export const injectNavigate = (_navigate: NavigateFunction) => {
  navigate = _navigate;
};

export const injectTranslate = (_tError: any) => {
  tError = _tError;
};

const userTimezone = getUserTimezone();
const timeOffset = getTimezoneOffset(userTimezone);

const AxiosClient = axios.create({
  headers: {
    "Content-Type": "application/json",
    "X-Timezone": timeOffset,
  },
  timeout: 30000, //timeout after 30 seconds
});

// list error message need logout when token expried
const listError: string[] = [
  "INVALID_REFRESH_TOKEN",
  // "Unauthorized",
  "REFRESH_TOKEN_EXPIRED",
  "invalid signature"
];

AxiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = getAuthToken("accessToken");
    const refreshToken = getAuthToken("refreshToken") as string;

    // controller for cancle request to server if refreshToken expried
    const controller = new AbortController();

    // check accesstoken already have on browser
    if (accessToken) {
      const decoded: JwtPayload = jwt.decode(accessToken) as JwtPayload;

      if (!decoded) {
        removeAuthToken();
        dispatch(logoutUser());
        navigate("/");

        controller.abort();
        return {
          ...config,
          signal: controller.signal,
        };
      }

      const accessTokenExp: number = decoded?.exp as number;

      const currentTime: number = Math.floor(
        new Date().getTime() / 1000 + 60 * 3,
      ); //check access token expried before 3 minutes

      // check accessToken still live or was expried
      if (currentTime >= accessTokenExp && !isRefreshToken) {
        isRefreshToken = true;
        const refreshToken = getAuthToken("refreshToken") as string;

        try {
          const response: IAuthToken = await apiMeService.getRefreshToken(
            accessToken,
            refreshToken,
          );

          if (response) {
            setAuthToken("accessToken", response.accessToken);
            setAuthToken("refreshToken", response.refreshToken);

            // Retry the original request with the new token
            config.headers.Authorization = `Bearer ${response.accessToken}`;
            isRefreshToken = false;

            return config;
          }
        } catch (error) {
          isRefreshToken = false;
          controller.abort();

          return {
            ...config,
            signal: controller.signal,
          };
        }
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (!accessToken || !refreshToken) {
      removeAuthToken();
      dispatch(logoutUser());
      navigate("/login");

      controller.abort();

      return {
        ...config,
        signal: controller.signal,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
AxiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const url: string = error.config.url;
    const resfreshTokenUrl: string =
      BASE_URL + API_VERSION.V1 + "/auth/admin/refresh-token";

    if (
      listError.includes(error.response.data.message) &&
      url === resfreshTokenUrl
    ) {
      isRefreshToken = false;
      removeAuthToken();
      dispatch(logoutUser());
      navigate("/login");
    }

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    // if retry more than 3 times, logout user
    if (error.response.status === 401 && url !== resfreshTokenUrl) {
      if (!error.config.retry || error.config.retry <= MAX_RETRY) {
        error.config.retry = error.config.retry ? error.config.retry + 1 : 1;
        return AxiosClient(error.config);
      }
    }

    if (
      error.response.status === 401 &&
      error.response.data.message === MESSAGE_ERROR.REFRESH_TOKEN_EXPIRED
    ) {
      message.error(tError(error.response.data.message));
    }

    if (error.response.status === 403) {
      message.error(tError(MESSAGE_ERROR.FORBIDDEN));
    }

    return Promise.reject(error);
  },
);

export default AxiosClient;
