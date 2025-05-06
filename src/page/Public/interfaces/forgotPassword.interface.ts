interface IForgotPasswordForm {
  email: string;
}

interface IForgotPasswordRequest {
  email: string;
}

interface IForgotPasswordOtpResponse {
  otp: string;
  expireAt: string;
}

export type {
  IForgotPasswordForm,
  IForgotPasswordRequest,
  IForgotPasswordOtpResponse,
};
