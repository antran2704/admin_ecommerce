export interface IVariantProductForm {
  [key: string]: {
    title: string;
    thumbnailUrl: string;
    basePrice: number;
    promotionPrice: number;
    stock: number;
    isActive: boolean;
  };
}
