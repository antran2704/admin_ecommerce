import {
  ENUM_ACCOUNT_STATUS,
  ENUM_GENDER,
  ENUM_TYPE_SETUP_PASSWORD,
} from "~/enum/user";
import { IFormStaff } from "~/interface/staff";

const initStaffForm: IFormStaff = {
  fullName: "",
  roles: "",
  groupRole: "",
  email: "",
  dateOfBirth: "",
  startDate: "",
  endDate: "",
  address: "",
  isPasswordGenerated: ENUM_TYPE_SETUP_PASSWORD.EMAIL,
  password: "",
  confirmPassword: "",
  gender: ENUM_GENDER.MALE,
  phoneNumber: "",
  codeArea: "84",
  workLocationId: "",
  clientId: "",
  status: ENUM_ACCOUNT_STATUS.ACTIVE,
};

export { initStaffForm };
