import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { initPagination } from "~/common/pagination";
import { parseQueryString } from "~/helper/url";
import { IResponseDataWithPagination } from "~/interface";
import { IPagination } from "~/interface/pagination";
import {
  IGetProductsRequest,
  IProductsResponse,
  IProductTable,
} from "../interfaces";
import { apiProductService } from "~/api-client/product";
import { ENUM_PRODUCT_STATUS } from "../enums";

const useProducts = (query?: Partial<IGetProductsRequest>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [data, setData] = useState<IProductsResponse[]>([]);
  const [dataTable, setDataTabel] = useState<IProductTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const handleGetData = async (paramater: Partial<IGetProductsRequest>) => {
    setLoading(true);

    await apiProductService
      .products(paramater)
      .then(
        ({
          data,
          pagination,
        }: IResponseDataWithPagination<IProductsResponse[]>) => {
          const dataTable: IProductTable[] = data.map(
            (x: IProductsResponse) => ({
              id: x.productId,
              key: x.productId,
              title: x.productName,
              thumbnail: x.thumbnail,
              mainCategoryName: x.mainCategoryName,
              stock: x.stock,
              basePrice: x.basePrice,
              promotionPrice: x.promotionPrice,
              status: x.isActive
                ? ENUM_PRODUCT_STATUS.ACTIVE
                : ENUM_PRODUCT_STATUS.INACTIVE,
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
    products: data,
    productTables: dataTable,
    handleGetProducts: handleGetData,
    onPaginationProducts: onPagination,
    paginationProducts: pagination,
    loadingProducts: loading,
  };
};

export default useProducts;
