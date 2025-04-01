import { ENUM_ACCOUNT_STATUS } from "~/enum/user";

export interface IUserTable {
  key: React.Key;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  providers: string[];
  status: ENUM_ACCOUNT_STATUS;
  createdAt: string;
}