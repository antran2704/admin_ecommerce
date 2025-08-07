import { ISearch } from "~/interface";
import { ENUM_ORDER_STATUS } from "../enums";

export interface IGetOrdersRequest extends ISearch {
  status?: ENUM_ORDER_STATUS;
}
