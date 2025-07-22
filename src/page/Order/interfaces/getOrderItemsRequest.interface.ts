import { ISearch } from "~/interface";

export interface IGetOrderItemsRequest extends ISearch {
  orderId: string;
}
