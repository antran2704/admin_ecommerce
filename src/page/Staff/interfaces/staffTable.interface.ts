import { ENUM_ACCOUNT_STATUS } from "~/enum/user";

export interface IStaffTable {
  key: React.Key;
  id: string;
  name: string;
  email: string;
  groupRole: string;
  role: string;
  status: ENUM_ACCOUNT_STATUS;
  createdAt: string;
}
