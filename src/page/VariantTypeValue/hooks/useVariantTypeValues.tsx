import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { initPagination } from "~/common/pagination";
import { parseQueryString } from "~/helper/url";
import { IResponseDataWithPagination } from "~/interface";
import { IPagination } from "~/interface/pagination";
import { IGetVariantTypeValuesRequest, IVariantTypeValueResponse, IVariantTypeValueTable } from "../interfaces";
import { apiVariantTypeValueService } from "~/api-client/variantTypeValue";


const useVariantTypes = (query?: Partial<IGetVariantTypeValuesRequest>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [data, setData] = useState<IVariantTypeValueResponse[]>([]);
  const [dataTable, setDataTabel] = useState<IVariantTypeValueTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const handleGetData = async (paramater: Partial<IGetVariantTypeValuesRequest>) => {
    setLoading(true);

    await apiVariantTypeValueService
      .variantTypeValues(paramater)
      .then(
        ({
          data,
          pagination,
        }: IResponseDataWithPagination<IVariantTypeValueResponse[]>) => {
          const dataTable: IVariantTypeValueTable[] = data.map(
            (x: IVariantTypeValueResponse) => ({
              id: x.variantTypeValueId,
              key: x.variantTypeValueId,
              title: x.variantTypeValueName,
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
    variantTypeValues: data,
    variantTypeValueTables: dataTable,
    handleGetVariantTypeValues: handleGetData,
    onPaginationVariantTypeValues: onPagination,
    paginationVariantTypeValues: pagination,
    loadingVariantTypeValues: loading,
  };
};

export default useVariantTypes;
