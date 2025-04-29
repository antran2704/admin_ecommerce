import { ENUM_PRODUCT_STATUS } from "../enums";

export interface IProductTable {
  key: React.Key;
  id: string;
  title: string;
  thumbnail: string;
  basePrice: number;
  promotionPrice: number;
  stock: number;
  isActive: ENUM_PRODUCT_STATUS;
  mainCategoryName: string;
  createdAt: string;
}
