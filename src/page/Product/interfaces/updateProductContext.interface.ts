import { IProductResponse } from "./productResponse.interface";

export interface IUpdateProductContext {
  product: IProductResponse | null;
  setProduct: (data: IProductResponse) => void;
}
