import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { initPagination } from "~/common/pagination";
import { parseQueryString } from "~/helper/url";
import { IResponseDataWithPagination } from "~/interface";
import { IPagination } from "~/interface/pagination";
import {
  IGetVariantTypesRequest,
  IVariantTypeResponse,
  IVariantTypeTable,
} from "../interfaces";
import { apiVariantTypeService } from "~/api-client/variantType";

const useVariantTypes = (query?: Partial<IGetVariantTypesRequest>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [data, setData] = useState<IVariantTypeResponse[]>([]);
  const [dataTable, setDataTabel] = useState<IVariantTypeTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const handleGetData = async (paramater: Partial<IGetVariantTypesRequest>) => {
    setLoading(true);

    await apiVariantTypeService
      .variantTypes(paramater)
      .then(
        ({
          data,
          pagination,
        }: IResponseDataWithPagination<IVariantTypeResponse[]>) => {
          const dataTable: IVariantTypeTable[] = data.map(
            (x: IVariantTypeResponse) => ({
              id: x.variantTypeId,
              key: x.variantTypeId,
              title: x.variantTypeName,
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
    variantTypes: data,
    variantTypeTables: dataTable,
    handleGetVariantTypes: handleGetData,
    onPaginationVariantTypes: onPagination,
    paginationVariantTypes: pagination,
    loadingVariantTypes: loading,
  };
};

export default useVariantTypes;
