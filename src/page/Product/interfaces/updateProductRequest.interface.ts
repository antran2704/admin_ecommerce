export interface IUpdateProductRequest {
  productName: string;
  description: string;
  thumbnail?: string;
  gallery?: string[];
  basePrice: number;
  promotionPrice: number;
  stock: number;
  mainCategory: string;
  subCategories: string[];
}
