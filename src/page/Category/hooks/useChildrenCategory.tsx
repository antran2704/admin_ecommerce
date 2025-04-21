import { useEffect, useState } from "react";

import {
  IChildCategoryResponse,
  IGetChildrenCategoryRequest,
} from "../interfaces";
import { apiCategoryService } from "~/api-client/category";

const useCategories = (query?: IGetChildrenCategoryRequest) => {
  const [data, setData] = useState<IChildCategoryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleGetData = async (paramater: IGetChildrenCategoryRequest) => {
    setLoading(true);

    await apiCategoryService
      .childrenOfCategory(paramater.parentId)
      .then((data: IChildCategoryResponse[]) => {
        setData(data);
      })
      .catch((err) => err);

    setLoading(false);
  };

  useEffect(() => {
    if (!query) return;

    handleGetData(query);
  }, [query]);

  return {
    childrendCategory: data,
    handleGetChildrendCategory: handleGetData,
    loadingChildrendCategory: loading,
  };
};

export default useCategories;
