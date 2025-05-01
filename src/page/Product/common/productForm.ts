import { IProductForm } from "../interfaces";

const initProductForm: IProductForm = {
  title: "",
  description: "",
  thumbnailUrl: "",
  thumbnailFile: null,
  gallery: [],
  basePrice: 0,
  promotionPrice: 0,
  stock: 0,
  isActive: true,
  mainCategory: "",
  subCategories: [],
};

export { initProductForm };
