import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { initPagination } from "~/common/pagination";
import { parseQueryString } from "~/helper/url";
import { IResponseDataWithPagination } from "~/interface";
import { IPagination } from "~/interface/pagination";
import {
  IGetVariantProductsRequest,
  IVariantProductResponse,
  IVariantProductTable,
} from "../interfaces";
import { apiVariantProductService } from "~/api-client/variantProduct";
import { ENUM_PRODUCT_STATUS } from "~/page/Product/enums";

const useVariantProducts = (query?: Partial<IGetVariantProductsRequest>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [data, setData] = useState<IVariantProductResponse[]>([]);
  const [dataTable, setDataTabel] = useState<IVariantProductTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const handleGetData = async (
    paramater: Partial<IGetVariantProductsRequest>,
  ) => {
    setLoading(true);

    await apiVariantProductService
      .products(paramater)
      .then(
        ({
          data,
          pagination,
        }: IResponseDataWithPagination<IVariantProductResponse[]>) => {
          const dataTable: IVariantProductTable[] = data.map(
            (x: IVariantProductResponse) => ({
              id: x.variantProductId,
              key: x.variantProductId,
              title: x.variantProductName,
              thumbnail: x.thumbnail,
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
    variantProducts: data,
    variantProductTables: dataTable,
    handleGetVariantProducts: handleGetData,
    onPaginationVariantProducts: onPagination,
    paginationVariantProducts: pagination,
    loadingVariantProducts: loading,
  };
};

export default useVariantProducts;
