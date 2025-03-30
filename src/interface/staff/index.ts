import {
  ENUM_ACCOUNT_STATUS,
  ENUM_GENDER,
  ENUM_TYPE_SETUP_PASSWORD,
} from "~/enum/user";
import { ISearch } from "../paramater";
import { IFile } from "../image";

interface IStaff {
  userId: string;
  fullName: string | null;
  email: string;
  dateOfBirth: string | null;
  workLocationId: string;
  gender: ENUM_GENDER | null;
  address: string | null;
  isActive: boolean;
  isAdmin: boolean;
  imageProfile: IFile | null;
  roles: string[];
  groups: string[];
  groupIds: string[];
  roleNames: string[];
  createdAt: string;
  workLocationAddress: string;
  startDate: string;
  endDate: string;
  phoneNumber: string;
  printerBalance: number;
  clientId: string;
}

interface IStaffTable {
  key: React.Key;
  id: string;
  name: string;
  email: string;
  groupRole: string;
  role: string;
  status: ENUM_ACCOUNT_STATUS;
  createdAt: string;
}

interface ICreateStaff {
  fullName: string;
  roles: string[];
  email: string;
  dateOfBirth?: string;
  startDate?: string;
  endDate?: string;
  gender: ENUM_GENDER;
  phoneNumber?: string;
  address: string;
  isPasswordGenerated: boolean;
  password: string;
  workLocationId: string;
  imageProfile: string;
  clientId: string;
}

interface ICreateStaffBatch {
  fullName: string;
  email: string;
  dateOfBirth?: string;
  startDate?: string;
  endDate?: string;
  phoneNumber?: string;
  address?: string;
  clientId?: string;
}

interface IUpdateStaff {
  fullName?: string;
  dateOfBirth?: string;
  roles: string[];
  gender: ENUM_GENDER;
  startDate?: string;
  endDate?: string;
  phoneNumber: string;
  address: string;
  workLocationId: string;
  clientId?: string;
}

interface IChangePasswordStaff {
  newPassword: string;
}

interface IFormStaff {
  fullName: string;
  roles: string;
  groupRole: string;
  email: string;
  dateOfBirth: string;
  startDate: string;
  endDate: string;
  gender: ENUM_GENDER;
  phoneNumber: string;
  codeArea: string;
  address: string;
  isPasswordGenerated: ENUM_TYPE_SETUP_PASSWORD;
  password: string;
  confirmPassword: string;
  workLocationId: string;
  status: ENUM_ACCOUNT_STATUS;
  clientId: string;
}

interface IStaffSearch extends ISearch {
  group?: string[];
  role?: string[];
  startDate?: string;
  endDate?: string;
  status?: ENUM_ACCOUNT_STATUS;
  buildingId?: string;
}

export type {
  IStaff,
  IStaffSearch,
  IStaffTable,
  ICreateStaff,
  ICreateStaffBatch,
  IUpdateStaff,
  IFormStaff,
  IChangePasswordStaff,
};
