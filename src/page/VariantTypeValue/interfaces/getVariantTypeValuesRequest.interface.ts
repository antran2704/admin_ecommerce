import { ISearch } from "~/interface";

export interface IGetVariantTypeValuesRequest extends ISearch {
  variantTypeId: string;
  tab?: string;
}
