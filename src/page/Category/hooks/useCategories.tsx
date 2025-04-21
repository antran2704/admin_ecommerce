import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { initPagination } from "~/common/pagination";
import { parseQueryString } from "~/helper/url";
import { IResponseDataWithPagination } from "~/interface";
import { IPagination } from "~/interface/pagination";
import {
  ICategoryTable,
  IGetCategoriesRequest,
  IListCategoryResponse,
} from "../interfaces";
import { apiCategoryService } from "~/api-client/category";

const useCategories = (query?: Partial<IGetCategoriesRequest>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [data, setData] = useState<IListCategoryResponse[]>([]);
  const [dataTable, setDataTabel] = useState<ICategoryTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const handleGetData = async (paramater: Partial<IGetCategoriesRequest>) => {
    setLoading(true);

    await apiCategoryService
      .categories(paramater)
      .then(
        ({
          data,
          pagination,
        }: IResponseDataWithPagination<IListCategoryResponse[]>) => {
          const dataTable: ICategoryTable[] = data.map(
            (x: IListCategoryResponse) => ({
              id: x.categoryId,
              key: x.categoryId,
              title: x.categoryName,
              childCount: x.childrenCount,
              thumbnail: x.categoryThumbnail,
              createdAt: x.createdAt,
            }),
          );

          setData(data);
          setDataTabel(dataTable);
          setPagination({
            page: pagination.page,
            take: pagination.take,
            total: pagination.total,
          });
        },
      )
      .catch((err) => err);

    setLoading(false);
  };

  useEffect(() => {
    if (!query) return;

    handleGetData(query);
  }, [query]);

  return {
    categories: data,
    categoriesTable: dataTable,
    handleGetCategories: handleGetData,
    onPaginationCategories: onPagination,
    paginationCategories: pagination,
    loadingCategories: loading,
  };
};

export default useCategories;
