import { ENUM_PRODUCT_STATUS } from "../enums";

export interface IVariantProductTable {
  key: React.Key;
  id: string;
  title: string;
  thumbnail: string;
  basePrice: number;
  promotionPrice: number;
  stock: number;
  status: ENUM_PRODUCT_STATUS;
  createdAt: string;
}
