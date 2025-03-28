interface ILogin {
  email: string;
  password: string;
}

interface IAuthToken {
  accessToken: string;
  refreshToken: string;
}

interface IConfirmForgotPasswordOtp {
  email: string;
  otp: string;
}


export type {
  ILogin,
  IAuthToken,
  IConfirmForgotPasswordOtp,
};
