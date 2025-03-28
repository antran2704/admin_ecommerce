import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { IProfileForm } from "../interfaces";

const initProfileForm: IProfileForm = {
  name: "",
  email: "",
  avatar: "",
  role: "",
  groupRole: "",
  status: ENUM_ACCOUNT_STATUS.ACTIVE,
  avatarFile: null,
  createdAt: ""
};

export { initProfileForm };