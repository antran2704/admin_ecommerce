import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { ISearch } from "~/interface";

export interface IGetUsersRequest extends ISearch {
  status?: ENUM_ACCOUNT_STATUS;
}
