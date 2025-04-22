import { useEffect, useState } from "react";

import { initPagination } from "~/common/pagination";
import { EOrderType } from "~/enum/paramater";
import { IResponseDataWithPagination } from "~/interface";

import { IPagination } from "~/interface/pagination";
import { IGetVariantTypesRequest, IVariantTypeResponse } from "../interfaces";
import { apiVariantTypeService } from "~/api-client/variantType";

const useScrollVariantTypes = (
  query?: Partial<IGetVariantTypesRequest> | null,
) => {
  const [data, setData] = useState<IVariantTypeResponse[]>([]);

  const [paramater, setParameter] = useState<IGetVariantTypesRequest>(
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

  const resetData = (paramater: IGetVariantTypesRequest) => {
    setData([]);
    setParameter(paramater);
    setPagination(initPagination);
  };

  const getDataScroll = async (paramater: IGetVariantTypesRequest) => {
    if (pagination.total && pagination.total <= data.length) return;

    await apiVariantTypeService
      .variantTypes(paramater)
      .then(
        ({
          data: services,
          pagination,
        }: IResponseDataWithPagination<IVariantTypeResponse[]>) => {
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
    variantTypes: data,
    paramaterVariantTypes: paramater,
    resetVariantTypes: resetData,
    onPaginationVariantTypes: onPagination,
  };
};

export default useScrollVariantTypes;
