export interface IUpdateProductRequest {
  productName: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  basePrice: number;
  promotionPrice: number;
  stock: number;
  isActive: boolean;
  mainCategoryId: string;
  subCategories: string[];
}
