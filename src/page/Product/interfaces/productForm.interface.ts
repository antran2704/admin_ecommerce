import { RcFile } from "antd/es/upload";

export interface IGalleryProductForm {
  url: string;
  file: RcFile | null;
}

export interface IProductForm {
  title: string;
  description: string;
  thumbnailUrl: string;
  thumbnailFile: File | null;
  gallery: IGalleryProductForm[];
  basePrice: number;
  promotionPrice: number;
  stock: number;
  isActive: boolean;
  mainCategory: string;
  subCategories: string[];
}
