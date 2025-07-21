export interface IVariantProductItemForm {
  title: string;
  thumbnailUrl: string;
  basePrice: number;
  promotionPrice: number;
  stock: number;
  isActive: boolean;
}

export interface IVariantProductForm {
  [key: string]: IVariantProductItemForm;
}
