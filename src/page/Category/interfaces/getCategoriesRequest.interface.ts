import { ISearch } from "~/interface";

export interface IGetCategoriesRequest extends ISearch {
  parentId?: string;
}
