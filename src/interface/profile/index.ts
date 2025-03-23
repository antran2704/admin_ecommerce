import { ENUM_ACCOUNT_STATUS, ENUM_GENDER } from "~/enum/user";

interface IMeProfile {
  userId: string;
  email: string;
  name: string;
  avaratar: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface IUpdateProfileMe {
  fullName: string;
  dateOfBirth: string;
  gender: ENUM_GENDER;
  phoneNumber: string;
  address: string;
}

interface IProfileForm {
  fullName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  codeArea: string;
  address: string;
  workLocationAddress: string;
  workLocationId: string;
  gender: ENUM_GENDER;
  role: string[];
  roleGroup: string[];
  status: ENUM_ACCOUNT_STATUS;
  startedAt: string;
  endedAt: string;
  createdAt: string;
}

export type { IMeProfile, IUpdateProfileMe, IProfileForm };
