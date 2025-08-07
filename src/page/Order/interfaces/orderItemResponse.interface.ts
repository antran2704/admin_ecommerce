export interface IOrderItemProductResponse {
  productId: string;
  name: string;
}

export interface IOrderItemVariantProductResponse {
  variantProductId: string;
  name: string;
  options: {
    id: string;
    name: string;
  }[];
}

export interface IOrderItemResponse {
  orderItemId: string;
  totalPrice: number;
  basePrice: number;
  promotionPrice: number;
  quantity: number;
  product: IOrderItemProductResponse;
  variantProduct: IOrderItemVariantProductResponse;
  thumbnail: string;
}
