import { DefaultOptionType } from "antd/es/select";

export interface ISelectVariantProductForm {
  variants: DefaultOptionType[];
  variantValues: { [x: string]: DefaultOptionType[] };
}
