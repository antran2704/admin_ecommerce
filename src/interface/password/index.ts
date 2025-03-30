interface ICheckPassword {
  id: number;
  title: string;
  regex: RegExp;
}

interface IChangePassword {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export type { ICheckPassword, IChangePassword };
