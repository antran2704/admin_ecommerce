export interface ICreateProductRequest {
  productName: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  basePrice: number;
  promotionPrice: number;
  stock: number;
  isActive: boolean;
  mainCategory: string;
  subCategories: string[];
}
