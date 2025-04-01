import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { IUserForm } from "../interfaces";

const initUserForm: IUserForm = {
  email: "",
  name: "",
  birthday: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  avatar: "",
  avatarFile: null,
  status: ENUM_ACCOUNT_STATUS.ACTIVE
};

export { initUserForm };
