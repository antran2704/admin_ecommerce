import { ENUM_ACCOUNT_STATUS, ENUM_TYPE_SETUP_PASSWORD } from "~/enum/user";
import { IFile } from "../image";
import { ISearch } from "../paramater";

interface IVehicleRegistrationImages {
  image1: IFile | null;
  image2: IFile | null;
}

interface IEndUser {
  userId: string;
  fullName: string;
  buildingId: string;
  address: string;
  tenantId: string;
  email: string;
  phoneNumber: string;
  otherPhoneNumber: string;
  parkingLotId: string;
  vehicleBrand: string;
  licensePlate: string;
  isActive: boolean;
  imageProfile: IFile | null;
  vehicleRegistrationImages: IVehicleRegistrationImages;
  createdAt: string;
  roles: string[];
  roleNames: string[];
  groups: string[];
  groupIds: string[];
  parkingLotName: string;
  tenantName: string;
  printerBalance: number;
  clientId: string;
}

interface IEndUserTable {
  key: React.Key;
  id: string;
  name: string;
  email: string;
  groupRole: string;
  role: string;
  status: ENUM_ACCOUNT_STATUS;
  createdAt: string;
}

interface ICreateEndUser {
  fullName: string;
  tenantId: string;
  email: string;
  phoneNumber: string;
  secondPhoneNumber: string;
  address: string;
  roles: string[];
  isPasswordGenerated: boolean;
  password: string;
  parkingLotId: string;
  vehicleBrand: string;
  licensePlate: string;
  vehicleRegistrationImages: {
    image1: string | null;
    image2: string | null;
  };
  imageProfile: string;
  clientId: string;
}

interface ICreateEndUserBatch {
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  clientId?: string;
}

interface IUpdateEndUser {
  fullName: string;
  phoneNumber: string;
  secondPhoneNumber: string;
  address: string;
  roles: string[];
  parkingLotId: string;
  vehicleBrand: string;
  licensePlate: string;
  clientId?: string;
}

interface IFormEndUser {
  fullName: string;
  email: string;
  phoneNumber: string;
  codeArea: string;
  secondPhoneNumber: string;
  secondCodeArea: string;
  address: string;
  roles: string;
  groupRole: string;
  parkingLotId: string;
  vehicleBrand: string;
  licensePlate: string;
  isPasswordGenerated: ENUM_TYPE_SETUP_PASSWORD;
  password: string;
  confirmPassword: string;
  vehicleRegistrationImages: string[];
  status: ENUM_ACCOUNT_STATUS;
  clientId: string;
}

interface IEndUserSearch extends ISearch {
  tenantId: string;
  tab?: string;
}

export type {
  IEndUser,
  IEndUserTable,
  ICreateEndUser,
  ICreateEndUserBatch,
  IUpdateEndUser,
  IEndUserSearch,
  IFormEndUser,
  IVehicleRegistrationImages,
};
