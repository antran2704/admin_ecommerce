interface IResetPasswordRequest {
  email: string;
  newPassword: string;
  otp: string;
}

export type { IResetPasswordRequest };
