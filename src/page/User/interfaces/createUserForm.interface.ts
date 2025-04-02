import { ENUM_ACCOUNT_STATUS } from "~/enum/user";

export interface IUserForm {
  email: string;
  name: string;
  avatar: string;
  avatarFile: File | null;
  phoneNumber: string;
  birthday: string;
  password: string;
  confirmPassword: string;
  status: ENUM_ACCOUNT_STATUS;
  banStatus: ENUM_ACCOUNT_STATUS;
}
