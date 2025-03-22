import { ENUM_ACCOUNT_STATUS, ENUM_GENDER } from "~/enum/user";
import { IFile } from "../image";

interface IProfile {
  userId: string;
  address: string | null;
  createdAt: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  email: string;
  fullName: string | null;
  gender: ENUM_GENDER;
  idCard: string | null;
  imageProfile: IFile | null;
  workLocationAddress: string | null;
  workLocationId: string | null;
  groups: string[];
  roleNames: string[];
  roles: string[];
  isAdmin: boolean;
  isActive: boolean;
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

export type { IProfile, IUpdateProfileMe, IProfileForm };
