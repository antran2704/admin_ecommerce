import { OptionProduct } from "./optionProduct.interface";
import { ISubCategoryProduct } from "./subCategoryProduct.interface";

export interface IProductResponse {
  productId: string;
  productName: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  basePrice: number;
  promotionPrice: number;
  isActive: boolean;
  mainCategoryId: string;
  mainCategoryName: string;
  subCategories: ISubCategoryProduct[];
  stock: number;
  options: OptionProduct[];
  createdAt: string;
}
