import { IVariantTypeValueResponse } from "~/page/VariantTypeValue/interfaces";

export type IVariantTypeValuesOfProduct = Omit<
  IVariantTypeValueResponse,
  "createdAt"
>;

export interface IVariantProductResponse {
  variantProductId: string;
  variantProductName: string;
  thumbnail: string;
  basePrice: number;
  promotionPrice: number;
  stock: number;
  isActive: boolean;
  variantTypeValues: IVariantTypeValuesOfProduct[];
  createdAt: string;
}
