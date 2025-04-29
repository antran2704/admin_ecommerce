import { ISearch } from "~/interface";
import { ENUM_PRODUCT_STATUS } from "../enums";

export interface IGetProductsRequest extends ISearch {
  status?: ENUM_PRODUCT_STATUS;
  categoryId?: string;
}
