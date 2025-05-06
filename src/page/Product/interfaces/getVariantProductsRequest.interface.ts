import { ISearch } from "~/interface";

export interface IGetVariantProductsRequest extends ISearch {
  productId: string;
}
