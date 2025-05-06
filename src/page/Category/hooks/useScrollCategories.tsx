import { useEffect, useState } from "react";

import { initPagination } from "~/common/pagination";
import { EOrderType } from "~/enum/paramater";
import { IResponseDataWithPagination } from "~/interface";

import { IPagination } from "~/interface/pagination";
import { IGetCategoriesRequest, IListCategoryResponse } from "../interfaces";
import { apiCategoryService } from "~/api-client/category";

const useScrollCategories = (query?: Partial<IGetCategoriesRequest> | null) => {
  const [data, setData] = useState<IListCategoryResponse[]>([]);

  const [paramater, setParameter] = useState<IGetCategoriesRequest>(
    query !== null
      ? {
          page: 1,
          take: 16,
          order: EOrderType.DESC,
          ...query,
        }
      : null,
  );

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number) => {
    setParameter({ ...paramater, page });
  };

  const resetData = (paramater: IGetCategoriesRequest) => {
    setData([]);
    setParameter(paramater);
    setPagination(initPagination);
  };

  const getDataScroll = async (paramater: IGetCategoriesRequest) => {
    if (pagination.total && pagination.total <= data.length) return;

    await apiCategoryService
      .categories(paramater)
      .then(
        ({
          data: services,
          pagination,
        }: IResponseDataWithPagination<IListCategoryResponse[]>) => {
          setData([...data, ...services]);
          setPagination({
            page: pagination.page,
            take: pagination.take,
            total: pagination.total,
          });
        },
      )
      .catch((err) => err);
  };

  useEffect(() => {
    if (!paramater) return;

    getDataScroll(paramater);
  }, [paramater]);

  return {
    categories: data,
    paramaterCategories: paramater,
    resetCategories: resetData,
    onPaginationCategories: onPagination,
  };
};

export default useScrollCategories;
