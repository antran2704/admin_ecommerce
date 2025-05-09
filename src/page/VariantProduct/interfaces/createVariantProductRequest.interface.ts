export interface ICreateVariantProductRequest {
  variantProductName: string;
  thumbnail: string;
  basePrice: number;
  promotionPrice: number;
  stock: number;
  isActive: boolean;
  productId: string;
  variantValueIds: string[];
}
