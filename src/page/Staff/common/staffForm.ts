import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { IStaffForm } from "../interfaces";

const initStaffForm: IStaffForm = {
  role: "",
  groupRole: "",
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
  avatar: "",
  avatarFile: null,
  status: ENUM_ACCOUNT_STATUS.ACTIVE,
};

export { initStaffForm };
