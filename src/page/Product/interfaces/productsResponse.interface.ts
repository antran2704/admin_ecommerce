export interface IProductsResponse {
  productId: string;
  productName: string;
  thumbnail: string;
  basePrice: number;
  promotionPrice: number;
  stock: number;
  isActive: boolean;
  mainCategoryId: string;
  mainCategoryName: string;
  createdAt: string;
}
