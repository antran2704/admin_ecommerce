import { ENUM_OTP_TYPE } from "~/enum/auth";

interface ILogin {
  email: string;
  password: string;
}

interface ISignup {
  phoneNumber: string;
  email: string;
  username: string;
  fullname: string;
  password: string;
  confirmPassword: string;
}

interface IForgotPassword {
  email: string;
  newPassword: string;
  verifyAccountOtp: string;
  confirmPassword: string;
}

interface IAuthToken {
  accessToken: string;
  refreshToken: string;
}

interface ISendOTP {
  email: string;
  type: ENUM_OTP_TYPE;
}

interface IVerifyOTP {
  email: string;
  otp: string;
  type: ENUM_OTP_TYPE;
}

interface IResponseOTP {
  createdAt: string;
  expiredTime: string;
  usageDuration: number;
}

export type {
  ILogin,
  IAuthToken,
  IForgotPassword,
  ISignup,
  ISendOTP,
  IVerifyOTP,
  IResponseOTP,
};
