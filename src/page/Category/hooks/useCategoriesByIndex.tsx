import { useEffect, useState } from "react";

import {
  IGetCategoriesByIndexRequest,
  IListCategoryResponse,
} from "../interfaces";
import { apiCategoryService } from "~/api-client/category";

const useCategoriesByIndex = (
  query?: Partial<IGetCategoriesByIndexRequest> | null,
) => {
  const [data, setData] = useState<IListCategoryResponse[]>([]);

  const handleGetData = async (paramater: IGetCategoriesByIndexRequest) => {
    await apiCategoryService
      .categoriesByIndex(paramater)
      .then((payload: IListCategoryResponse[]) => {
        setData(payload);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (!query) return;

    handleGetData(query);
  }, [query]);

  return {
    categories: data,
  };
};

export default useCategoriesByIndex;
