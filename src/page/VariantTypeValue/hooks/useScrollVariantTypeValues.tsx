import { useEffect, useState } from "react";

import { initPagination } from "~/common/pagination";
import { EOrderType } from "~/enum/paramater";
import { IResponseDataWithPagination } from "~/interface";

import { IPagination } from "~/interface/pagination";
import { IGetVariantTypeValuesRequest, IVariantTypeValueResponse } from "../interfaces";
import { apiVariantTypeValueService } from "~/api-client/variantTypeValue";

const useScrollVariantTypeValues = (
  query?: Partial<IGetVariantTypeValuesRequest> | null,
) => {
  const [data, setData] = useState<IVariantTypeValueResponse[]>([]);

  const [paramater, setParameter] = useState<IGetVariantTypeValuesRequest>(
    query !== null
      ? {
          page: 1,
          take: 16,
          order: EOrderType.DESC,
          variantTypeId: "",
          ...query,
        }
      : null,
  );

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number) => {
    setParameter({ ...paramater, page });
  };

  const resetData = (paramater: IGetVariantTypeValuesRequest) => {
    setData([]);
    setParameter(paramater);
    setPagination(initPagination);
  };

  const getDataScroll = async (paramater: IGetVariantTypeValuesRequest) => {
    if (pagination.total && pagination.total <= data.length) return;

    await apiVariantTypeValueService
      .variantTypeValues(paramater)
      .then(
        ({
          data: services,
          pagination,
        }: IResponseDataWithPagination<IVariantTypeValueResponse[]>) => {
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
    variantTypeValues: data,
    paramaterVariantTypeValues: paramater,
    resetVariantTypeValues: resetData,
    onPaginationVariantTypeValues: onPagination,
  };
};

export default useScrollVariantTypeValues;
